import './styles.css'

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

const Routes = () => {
    return(
        <>
            <Header/>
            <div className="container-fluid h-100">
                <div className="row h-100">
                    <Sidebar/>
                </div>
            
            </div>
        </>
    );
};

export default Routes;