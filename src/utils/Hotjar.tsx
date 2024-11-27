import Script from "next/script";

const siteId = 5221224;
const hotjarVersion = 6;

const Hotjar = () => {
  return (
    <Script
      async
      key="hotjar"
      src={`https://static.hotjar.com/c/hotjar-${siteId}.js?sv=${hotjarVersion}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
};

export default Hotjar;
