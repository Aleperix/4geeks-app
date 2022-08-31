const teacher = ({
  width, height, style, color,
}) => (
  <svg
    width={width || '24'}
    height={height || '24'}
    style={style}
    xmlns="http://www.w3.org/2000/svg"
    fillRule="evenodd"
    clipRule="evenodd"
    stroke={color || '#0097CD'}
  >
    <path d="M20.997 18.529c-.372.223-1.044.565-1.997.904v-5.038c-3.979.327-6.323 1.521-7 1.954-.677-.433-3.022-1.627-7-1.954v5.037c-.954-.339-1.625-.681-1.996-.902l-.004-1.944c-.008-2.036.06-2.531 1.863-2.929 2.28-.507 4.616-.775 5.225-2.323.282-.713.117-1.509-.488-2.365-1.588-2.246-2.007-4.36-1.183-5.952.645-1.244 2.018-2.017 3.583-2.017 1.562 0 2.932.766 3.573 1.999.827 1.587.409 3.709-1.175 5.973-.6.857-.762 1.652-.481 2.362.607 1.534 2.929 1.815 5.219 2.323 1.805.398 1.873.898 1.863 2.957l-.002 1.915zm-2.997 2.465c-1.588.287-3.853.925-5.5 1.638v-5.431c1.216-.783 3.666-1.472 5.5-1.707v5.5zm-6.5 1.638c-1.648-.713-3.912-1.351-5.5-1.638v-5.5c1.834.235 4.284.924 5.5 1.707v5.431zm7.851-9.952c-2.865-.632-5.663-.951-4.133-3.134 3.885-5.555.702-9.546-3.218-9.546s-7.12 4.022-3.218 9.546c1.557 2.203-1.328 2.516-4.134 3.134-2.56.566-2.656 1.783-2.648 3.91l.004 2.475s.957.758 2.996 1.431v1.352c.148.022 3.57.457 7 2.131 3.429-1.673 6.866-2.111 7-2.131v-1.352c2.039-.673 2.996-1.431 2.996-1.431l.003-2.451c.01-2.143-.077-3.366-2.648-3.934z" />
  </svg>
);

export default teacher;
