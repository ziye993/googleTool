import React, { useEffect, useRef, useState } from "react";
import { Switch, Divider, Image, Space, Button, Form, Input } from "antd";
import { IThemeList } from "types/index.type";
import {
  compress,
  groupBase64,
  handUseTheme,
  setThemeConfig,
  switchChange,
} from "./lib";
import "./index.css";

const ThemeBar: React.FC = function () {
  const [themeList, setThemeList] = useState<IThemeList>([]);
  const [isRead, setIsRead] = useState(false);
  const [status, setStatus] = useState(false);
  const imageRef = useRef<any[]>([]);

  const imageInputChange = (e: any) => {
    const file = e.target.files[0];
    const file_reader = new FileReader();
    file_reader.readAsDataURL(file);
    file_reader.onload = (res: any) => {
      const data = res.target.result;
      const key = String(Math.random()).split(".")[1];
      compress(data, 30000, (result: string) => {
        let newList: any[] = [];
        setThemeList((prevState: IThemeList = []) => {
          const newState = [...prevState];
          newState.push({
            imageUrl: result,
            key: `ziye_${key}`,
          });
          newList = newState;
          return newState;
        });
        (chrome || {})?.storage?.local?.get?.(
          "compressThemeList",
          (res: any) => {
            const compressThemeList = res.compressThemeList || [];
            compressThemeList.push({ imageUrl: result, key: `ziye_${key}` });
            (chrome || {})?.storage?.local?.set?.(
              { compressThemeList: newList },
              () => []
            );
          }
        );
      });
      compress(data, 500000, async (result: string, config: any) => {
        const arr = await groupBase64(result, config.height);

        (chrome || {})?.storage?.local?.set?.(
          { [`ziye_${key}`]: arr },
          () => []
        );
      });
    };
  };

  const inputUrl = () => {};
  const removeImage = (key: string, index: number) => {
    (chrome || {})?.storage?.local?.remove?.(key, () => {
      setThemeList((prevState: IThemeList = []) => {
        const newState = [...prevState];
        newState.splice(index, index + 1);
        (chrome || {})?.storage?.local?.set?.(
          { compressThemeList: newState },
          () => []
        );
        return newState;
      });
    });
  };
  useEffect(() => {
    (chrome || {})?.storage?.local?.get?.(
      ["config", "compressThemeList"],
      async (res: any) => {
        const config = res.config || {};
        const compressThemeList = (await res.compressThemeList) || [];
        await setStatus(config.themeStatus);
        await setThemeList(compressThemeList);
        await setIsRead(true);
      }
    );
  }, []);

  if (!isRead) {
    return <></>;
  }

  return (
    <div className="themeBox">
      <div className="themeHead">
        <span className="themeFileBox">
          <input
            type="file"
            className="uploadFile"
            onChange={imageInputChange}
          />
        </span>
        <Input.Group compact style={{ flex: 1, padding: "0 10px" }}>
          <Input
            style={{ width: "calc(100% - 200px)" }}
            defaultValue=""
            onChange={(e) => {
              console.log("1");
            }}
          />
          <Button
            type="primary"
            onClick={() => {
              console.log("1");
            }}
          >
            添加
          </Button>
        </Input.Group>
        <div>
          <span>主题：</span>
          <Switch
            checkedChildren="开"
            unCheckedChildren="关"
            defaultChecked={status}
            onChange={switchChange}
          />
        </div>
      </div>

      <Divider plain={true} orientation={"right"}>
        选择你的主题
      </Divider>
      <Space size="large">
        {themeList.map((item, index) => {
          imageRef.current[index] = {};
          return (
            <div
              key={`image_${index}`}
              className="themeItemBox"
              ref={imageRef.current[index]}
            >
              <Image
                preview={false}
                className="themeCover"
                height={100}
                src={item.imageUrl}
                onLoad={() => {
                  setThemeConfig(imageRef.current[index].current, item.key);
                }}
              />
              <div className="itemPreview">
                <Button ghost={true} onClick={() => handUseTheme(item.key)}>
                  使用
                </Button>
                <Button ghost={true}>预览</Button>
                <Button
                  ghost={true}
                  danger={true}
                  onClick={() => {
                    removeImage(item.key, index);
                  }}
                >
                  删除
                </Button>
              </div>
            </div>
          );
        })}
      </Space>
    </div>
  );
};

export default ThemeBar;
