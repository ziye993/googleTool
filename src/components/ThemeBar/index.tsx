import React, { useRef, LegacyRef, useState, useEffect } from 'react';
import { Switch, Divider, Image, Space, Button, Form, Input } from 'antd';
import * as indexType from 'types/index.type';
import * as lib from './lib';
import './index.css';
import UpLoadFile from './upLoadFile';

function ThemeBar(): any {
  const [themeList, setThemeList] = useState<indexType.IThemeList>([]);
  const [isRead, setIsRead] = useState(false);
  const [status, setStatus] = useState(false);
  const imageRef = useRef<any[]>([]);
  const imageInputChange = (e: { target: { files: [{ file: any }] } }) => {
    const [file] = e.target.files;
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file as any);
    fileReader.onload = (res: any = {}) => {
      const data = res?.target?.result || '';
      const [key] = String(Math.random()).split('.');
      lib.compress(data, 30000, (result: string) => {
        let newList: any[] = [];
        setThemeList((prevState: indexType.IThemeList = []) => {
          const newState = [...prevState];
          newState.push({
            imageUrl: result,
            key: `ziye_${key}`,
          });
          newList = newState;
          return newState;
        });
        (chrome || {})?.storage?.local?.get?.(
          'compressThemeList',
          (res: any) => {
            const compressThemeList = res.compressThemeList || [];
            console.log("compressThemeList",res)
            compressThemeList.push({ imageUrl: result, key: `ziye_${key}` });
            (chrome || {})?.storage?.local?.set?.(
              { compressThemeList: newList },
              () => [],
            );
          },
        );
      });
      lib.compress(data, 500000, async (result: string, config: any) => {
        const arr = await lib.groupBase64(result, config.height);
        (chrome || {})?.storage?.local?.set?.(
          { [`ziye_${key}`]: arr },
          () => [],
        );
      });
    };
  };

  const inputUrl = () => {

  };
  const removeImage = (key: string, index: number) => {
    (chrome || {})?.storage?.local?.remove?.(key, () => {
      setThemeList((prevState: indexType.IThemeList = []) => {
        const newState = [...prevState];

        newState.splice(index, index + 1);
        (chrome || {})?.storage?.local?.set?.(
          { compressThemeList: newState },
          () => [],
        );
        return newState;
      });
    });
  };

  useEffect(() => {
    (chrome || {})?.storage?.local?.get?.(
      ['config', 'compressThemeList'],
      async (res: any) => {
        const config = res.config || {};
        const compressThemeList = (await res.compressThemeList) || [];
        await setStatus(config.themeStatus);
        await setThemeList(compressThemeList);
        await setIsRead(true);
      },
    );
    if (!chrome?.storage?.local) {
      setIsRead(true);
    }
  }, []);

  if (!isRead) {
    return <></>;
  }

  return (
    <div className="themeBox">
      <div className="themeHead">
        <UpLoadFile imageInputChange={imageInputChange}>
          {'上传图片'}
        </UpLoadFile>
        <Input.Group compact style={{ flex: 1, padding: '0 10px' }}>
          <Input style={{ width: 'calc(100% - 200px)' }} defaultValue="" onChange={(e) => {

          }} />
          <Button type="primary" onClick={() => {
          }} > 添加 </Button>
        </Input.Group>
        <div>
          <span>主题：</span>
          <Switch
            checkedChildren="开"
            unCheckedChildren="关"
            defaultChecked={status}
            onChange={lib.switchChange}
          />
        </div>
      </div>

      <Divider plain={true} orientation={'right'}>
        选择你的主题
      </Divider>
      <Space size="large">
        {themeList.map((item, index) => {
          imageRef.current[index] = {} as LegacyRef<HTMLDivElement> | undefined;
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
                  lib.setThemeConfig(imageRef.current[index].current, item.key);
                }}
              />
              <div className="itemPreview">
                <Button ghost={true} onClick={() => lib.handUseTheme(item.key)}>
                  使用
                </Button>
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
}

export default ThemeBar;
