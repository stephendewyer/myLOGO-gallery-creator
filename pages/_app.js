import '../styles/globals.css';
import Layout from '../components/layout/Layout';
import { SessionProvider } from "next-auth/react";
import 'nprogress/nprogress.css';
import NProgress from 'nprogress';
import Router from 'next/router';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

function MyApp({ 
  Component, 
  pageProps: {
    session, 
    ...pageProps
  },
 }) {
  return (
    <SessionProvider session={session} refetchInterval={5 * 60}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
      </SessionProvider>

  )
}

export default MyApp
