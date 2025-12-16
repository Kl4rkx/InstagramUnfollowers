import React from 'react';
import { TranslationKey } from '../constants/translations';

interface NotSearchingProps {
  onScan?: () => void;
  t: (key: TranslationKey) => string;
}

export const NotSearching = ({onScan, t}: NotSearchingProps) => (
  <button className='run-scan' onClick={onScan}>
    {t("run")}
  </button>
);
