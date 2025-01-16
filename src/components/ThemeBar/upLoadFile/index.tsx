import React from 'react';
import { Button } from 'antd';
import './index.css';

interface IUpLoadFileProps {
  imageInputChange: (e: any) => void;
  children?: any;
}

const UpLoadFile: React.FC<IUpLoadFileProps> = function (
  props: IUpLoadFileProps,
) {
  return (
    <div className="uploadFileBox">
      <Button className="uploadFileText">
        {props.children}
        <input
          type="file"
          className="uploadFile"
          onChange={props.imageInputChange}
        />
      </Button>
    </div>
  );
};

export default UpLoadFile;
