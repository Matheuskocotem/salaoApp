import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png'; 

const Sidebar = () => {
  return (
    <aside className="col-2 h-100">
      <img src={logo} alt="Logo" className="img-fluid px-3 py-4" />
      <ul className="p-0 m-0">
        <li>
          <Link to="/">
            <span className="mdi mdi-calendar-check"></span>
            <span>Agendamentos</span>
          </Link>
        </li>
        <li>
          <Link to="/clientes">
            <span className="mdi mdi-account-multiple"></span>
            <span>Clientes</span>
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
