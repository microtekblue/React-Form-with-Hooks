import React from 'react';
import './App.css';
import { useState } from 'react';

function App() {

  const [auth, setAuth] = useState([{ username: '', password: '' }]);
  const [cookie, setCookie] = useState(false);
  const [onError, setOnError] = useState(false);
  const [search, setSearch] = useState('');
  const [data, setData] = useState([]);


  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(auth.username + ' : ' + auth.password);
    fetchLogin(auth.username,auth.password);
  };

  async function fetchLogin(username,password) {
    const post_url = '//3.122.7.162:5000/v60/admin/session';

    const data = { username: username, credential: password };

    try {
      const response = await fetch(post_url, {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        method: 'POST',
        body: JSON.stringify(data),
      });
      const json = await response.json();

      setCookie(true);
      return json;

    } catch (error) {
      console.error('Error:', error);
      setOnError(true);
    }
  }

  const handleAuth = (event) => {
    const target = event.target;

    const username = {...auth, username: target.value};
    const password = {...auth,password: target.value};

    if(target.type === 'text') {
      setAuth(username);
    } else {
      setAuth(password);
    }
  };

  async function fetchSearch(text,alias) {
    const get_url = '//3.122.7.162:5000/v60/admin/search/user?keyword='+text+'&alias='+alias;

    try {
      const response = await fetch(get_url, {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        method: 'GET'

      });
      const json = await response.json();

      //console.log(json);
      setData(json);

    } catch (error) {
      //console.error('Error:', error);
    }
  }

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    fetchSearch(search,false);
  };

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

console.log(JSON.stringify(data));


  return (
    <div className="App">

      {!cookie &&
        <form className="login" onSubmit={handleSubmit}>

          <h1>Login</h1>

          <div className="wrap">

            <label>
              <input type="text" name="name" placeholder="admin" onChange={handleAuth}/>
            </label>
            <br/>
            <label>
              <input type="password" name="name" placeholder="****" onChange={handleAuth}/>
            </label>
            <br/>
            <div className="right">
              <input className="btn" type="submit" value="Login"/>
            </div>

            <br/>
            <hr/>
            {onError &&
            <div>
              <p style={{textAlign: 'left'}}>Please contact the System Administrator at extension 1001 to create a new
                Login or reset your password.</p>
            </div>
            }

          </div>
        </form>
      }

      {cookie &&
          <form className="search" onSubmit={handleSearchSubmit}>
            <h1>Search User</h1>
            <input type="text" name="search" placeholder="Enter User Name" onChange={handleSearch}/>

            <input className="btn" type="submit" value="Search"/>
          </form>
      }


      {data.length > 0 &&
          <div className="results">

            <h2><span>Search Results For:</span> {search}</h2>

            <h3>Users</h3>

            <table>
              <thead>
              <tr>
                <th>Username</th>
                <th>Name</th>
                <th>Status</th>
              </tr>
              </thead>
              <tbody>
              {
                data.map((item,index) =>{
                  return <tr key={index}>
                    <td>{item.username}</td>
                    <td>{item.displayName}</td>
                    <td>{item.status}</td>
                  </tr>;
                })
              }
              </tbody>
            </table>
          </div>
      }
    </div>
  );
}

export default App;
