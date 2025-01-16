import React, { useEffect, useState } from 'react';
import { Checkbox } from 'antd';

interface IAccordingToLimitCheckBoxProps {
  min?: number,
  max?: number,
  value?: number,
  onChange?: (e: any) => void
}

export const AccordingToLimitCheckBox = (props: IAccordingToLimitCheckBoxProps) => {
  const { max = Number.MAX_SAFE_INTEGER, min = 0, value = props.min || 0, onChange } = props;
  const indeterminate = value > min && value < max;
  const checked = value === max;
  return <Checkbox indeterminate={indeterminate} checked={checked} onChange={onChange} />
}