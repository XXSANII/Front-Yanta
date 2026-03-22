import Employee from './components/Employee';
import './App.css';

function App() {
  const showEmployee = true;

  return (
    <div className='App'>
      {showEmployee ? (
        <>
          <Employee />
          <Employee />
        </>
      ) : (
        <h3>No Employees to Show</h3>
      )}
    </div>
  );
}

export default App;