import '../public/css/global.css';
import '../public/css/tippy.css';
import 'tailwindcss/tailwind.css';
import NProgress from 'nprogress';
import Router from 'next/router';
import Head from 'next/head';
import Script from 'next/script';
import { useEffect } from 'react';

import Header from '../components/Static/Header.jsx';
import Footer from '../components/Static/Footer.jsx';

export default function Swoth({ Component, pageProps }) {
    useEffect(() => {
        NProgress.configure({ showSpinner: false });

        const handleStart = () => NProgress.start();
        const handleStop = () => NProgress.done();

        Router.events.on('routeChangeStart', handleStart);
        Router.events.on('routeChangeComplete', handleStop);
        Router.events.on('routeChangeError', handleStop);

        return () => {
            Router.events.off('routeChangeStart', handleStart);
            Router.events.off('routeChangeComplete', handleStop);
            Router.events.off('routeChangeError', handleStop);
        };
    }, []);

    return (
        <>
            <Head>
                <link rel="preconnect" href="https://fonts.gstatic.com" />
                <link rel="icon" href="/img/favicon.png" type="image/x-icon" />
                <link href="https://pro.fontawesome.com/releases/v6.0.0-beta1/css/all.css" rel="stylesheet" />
                <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet" />
                <link rel="stylesheet" href="/css/nprogress.css" />
            </Head>
            <main className="overflow-y-hidden md:overflow-y-visible min-h-[calc(100vh-14px)] max-w-screen-lg p-5 w-full md:py-10 md:w-10/12 lg:py-20 lg:w-8/12 mx-auto transition-all duration-300">
                <Header />
                <Component {...pageProps} />
                <Footer />
            </main>
            <Script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js" strategy="afterInteractive" />
            <Script src="/js/main.js" strategy="afterInteractive" />
        </>
    );
};
