import './App.css';
import { createPow, powTypes } from "@textile/powergate-client"
import { useEffect, useState } from 'react';

function App() {

  const host = "http://localhost:6002"

  const [userToken, setUserToken] = useState('');
  const [userId, setUserId] = useState('');
  const [address, setAddress] = useState('');
  const [cid, setCid] = useState('');
  const [jobId, setjobId] = useState('');
  const [selectedFile, setSelectedFile] = useState();
  const [isFilePicked, setIsFilePicked] = useState(false);

  const pow = createPow({ host })

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
    setIsFilePicked(true);
  };

  async function crearUsuario() {
    pow.admin.users.create().then(
      res => {
        if (res.user) {
          setUserToken(res.user.token)
          setUserId(res.user.id)

          pow.setAdminToken("f75cc186-8ccb-4d12-a0db-3ba2ceb5974b")
          pow.setToken(res.user.token)

          pow.wallet.addresses().then(
            v => {
              setAddress(v.addressesList[0].address)
            },
            console.error
          )
          pow.storageConfig.default().then(
            v => {
              console.log(v.defaultStorageConfig, null, 2)
            }
          )
        }
      },
      console.error
    )
  }

  async function subirArchivo() {
    pow.setAdminToken("f75cc186-8ccb-4d12-a0db-3ba2ceb5974b")
    pow.setToken(userToken)

    pow.data.stage(selectedFile).then(
      res => {
        console.log(res.cid)
        setCid(res.cid);
        setjobId(pow.storageConfig.apply(res.cid))
      },
      err => {
        console.error("failed to stage file:", err)
      }
    )
  }

  async function getDataArchivo(){
    pow.setAdminToken("f75cc186-8ccb-4d12-a0db-3ba2ceb5974b")
    pow.setToken(userToken)

    pow.data.cidInfo(cid).then(
      res => {
        console.log(res)
      },
      err => {
        console.error(err)
      }
    )

  }

  return (
    <div className="App">
      <header className="App-header">
        <h2>Crear usuario</h2>
        <button onClick={crearUsuario}>
          Crear Usuario
        </button>
        <h3>Token de Usuario: {userToken}</h3>
        <h3>Id de Usuario: {userId}</h3>
        <h3>Wallet Addres: {address}</h3>

        <h2>Subir archivo</h2>
        <div>
          <input type="file" name="file" onChange={changeHandler} />
          <div>
            <button onClick={subirArchivo}>Submit</button>
          </div>
          <div>
            <button onClick={getDataArchivo}>Ver Archivo</button>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
