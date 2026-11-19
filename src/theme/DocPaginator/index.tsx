/**
 * Wraps the doc paginator so previous/next labels of untranslated docs use the
 * localized labels from code.json (see src/lib/docLabel.ts).
 */
import React, {type ReactNode} from 'react';
import DocPaginator from '@theme-original/DocPaginator';
import type DocPaginatorType from '@theme/DocPaginator';
import type {WrapperProps} from '@docusaurus/types';
import {docIdFromPermalink, localizedDocLabel} from '@site/src/lib/docLabel';

type Props = WrapperProps<typeof DocPaginatorType>;
type NavLink = NonNullable<Props['previous']>;

function localize(link: NavLink | undefined): NavLink | undefined {
  return link && {...link, title: localizedDocLabel(docIdFromPermalink(link.permalink), link.title)};
}

export default function DocPaginatorWrapper(props: Props): ReactNode {
  return <DocPaginator {...props} previous={localize(props.previous)} next={localize(props.next)} />;
}
