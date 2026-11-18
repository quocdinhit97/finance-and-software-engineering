import React, {type ReactNode} from 'react';
import TOC from '@theme-original/TOC';
import type TOCType from '@theme/TOC';
import type {WrapperProps} from '@docusaurus/types';
import Translate from '@docusaurus/Translate';
import styles from './styles.module.css';

type Props = WrapperProps<typeof TOCType>;

/** Right-hand "On this page" column with a heading. */
export default function TOCWrapper(props: Props): ReactNode {
  return (
    <div className={styles.wrap}>
      <p className={styles.heading}>
        <Translate id="toc.heading">Trên trang này</Translate>
      </p>
      <TOC {...props} />
    </div>
  );
}
