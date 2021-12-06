import { Icon } from './Icon';

import '../styles/button.scss';
import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  iconName: 'action' | 'comedy' | 'documentary' | 'drama' | 'horror' | 'family';
  selected: boolean;
}

export function Button({ iconName, title, selected, ...rest }: ButtonProps) {

  const buttonClass = selected ? 'selected' : undefined
  const iconColor = selected ? '#FAE800' : '#FBFBFB'

  return (
    <button type="button" className={buttonClass} {...rest}>
      <Icon name={iconName} color={iconColor} />
      {title}
    </button>
  );
}