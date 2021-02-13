const Loader: React.FC<{ show: boolean }> = ({ show }) => {
  return show ? <div className='loader'></div> : null;
};

export default Loader;
