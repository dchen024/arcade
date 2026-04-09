interface Props {
  html: string
}

export const Iframe = (props: Props) => {
  return (
    <iframe
      srcDoc={props.html}
      style={{ border: 'none', display: 'block', width: '100vw', height: '100vh' }}
      sandbox="allow-scripts allow-same-origin"
    />
  );
};

