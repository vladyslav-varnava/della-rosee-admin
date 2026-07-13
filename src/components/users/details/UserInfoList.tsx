import { Children, Fragment, ReactNode } from 'react';

import { Separator, Stack } from '@chakra-ui/react';

type Props = {
  children: ReactNode;
};

export const UserInfoList = ({ children }: Props) => {
  const items = Children.toArray(children);

  return (
    <Stack gap={0}>
      {items.map((child, index) => (
        <Fragment key={index}>
          {index > 0 && <Separator />}
          {child}
        </Fragment>
      ))}
    </Stack>
  );
};
