import { useNavigate } from "react-router-dom";
const Footer = () => {
  const navigate = useNavigate();
  return (
    <>
      <nav className="navbar navbar-dark bg-body fixed-bottom">
        <div className="container-fluid justify-content-center">
          <ul className="navbar-nav d-flex flex-row mb-2 mb-lg-0 justify-content-center w-100 ">
            <li className="nav-item mx-3 badge bg-dark ">
              <button className="nav-link " onClick={() => navigate(-1)}>
                <i className="fa-solid fa-arrow-left "></i>
              </button>
            </li>
            {/* <li className="nav-item mx-3 badge bg-dark">
              <button className="nav-link active" aria-current="page">
                <i className="fas fa-home"></i>
              </button>
            </li>
            <li className="nav-item mx-3 badge bg-dark">
              <button className="nav-link active" href="#">
                <i className="fas fa-store"></i>
              </button>
            </li>
            <li className="nav-item mx-3 badge bg-dark">
              <a className="nav-link active" href="#">
                <i className="fas fa-search"></i>
              </a>
            </li>
            <li className="nav-item mx-3 badge bg-dark">
              <a className="nav-link active">
                <i className="fas fa-user"></i>
              </a>
            </li> */}
            <li className="nav-item mx-3 badge bg-dark">
              <button className="nav-link" onClick={() => navigate(1)}>
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};
export default Footer;
