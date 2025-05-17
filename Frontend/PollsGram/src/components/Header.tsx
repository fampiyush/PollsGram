
const Header = () => {

  return (
    <div id='header'>
      <div className='header-side' /> {/* Left spacer */}
      <h1 id='header-title'>PollsGram</h1>
      <div id='header-menu-container'>
        <button className="header-menu-btn">Home</button>
        <button className="header-menu-btn">Profile</button>
      </div>
    </div>
  );
};

export default Header;