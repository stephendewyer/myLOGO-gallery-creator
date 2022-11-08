import React from 'react';
import Link from 'next/link';

const MyLink = React.forwardRef(
    (
      { as, children, href, replace, scroll, shallow, passHref, ...rest }, // extract all next/link props and pass the rest to the anchor tag
      ref,
    ) => (
      <Link as={as} href={href} passHref={passHref} replace={replace}>
        <div {...rest} ref={ref} style={{cursor: "pointer"}}>
          {children}
        </div>
      </Link>
    ),
);

  export default MyLink;