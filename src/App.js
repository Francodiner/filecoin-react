import './App.css';
import { createPow, powTypes } from "@textile/powergate-client"
import { useEffect, useState } from 'react';
import { Alert, Button, Table, Form } from 'react-bootstrap'

function App() {

  const host = "http://localhost:6002"

  const [userToken, setUserToken] = useState('');
  const [userId, setUserId] = useState('');
  const [address, setAddress] = useState('');
  const [cid, setCid] = useState('');
  const [jobId, setjobId] = useState('');
  const [fileName, setFileName] = useState('');
  const [selectedFile, setSelectedFile] = useState();
  const [fileStatus, setFileStatus] = useState('');
  const [isFilePicked, setIsFilePicked] = useState(false);

  const pow = createPow({ host })

  useEffect(()=> {
    pow.setAdminToken("f75cc186-8ccb-4d12-a0db-3ba2ceb5974b")
  }) 

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
    setFileName(event.target.files[0].name)
    setIsFilePicked(true);
  };

  async function crearUsuario() {
    pow.admin.users.create().then(
      res => {
        if (res.user) {
          setUserToken(res.user.token)
          setUserId(res.user.id)

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
    pow.setToken(userToken)

    pow.data.stage(selectedFile).then(
      res => {
        setCid(res.cid);
        setjobId(pow.storageConfig.apply(res.cid))
      },
      err => {
        console.error("failed to stage file:", err)
      }
    )
  }

  async function getDataArchivo() {
    pow.setToken(userToken)

    pow.data.cidInfo(cid).then(
      res => {
        setFileStatus(res.cidInfo.executingStorageJob.status)
      },
      err => {
        console.error(err)
      }
    )

  }

  return (
    <div className='background-img'>
      <div className="App">
        <Alert variant="info">
          <Alert.Heading>Open4Blockchain - Filecoin Powergate</Alert.Heading>
          <p>
            Powergate nos brinda una interfaz más sencilla y un mejor rendimiento de Filecoin.
            Podemos administrar nuestros nodos y también obtener acceso a configuraciones de almacenamiento como por ejemplo selección de minero.
          </p>
          <hr />
          <p className="mb-0">Seguir los pasos a continuación...</p>
        </Alert>
        <div className='info'>
          <Button variant="light" className='mt-top' onClick={crearUsuario}>Crear Usuario</Button>
          <div className='container'>

            <Table striped bordered hover variant="dark" className='mt-top'>
              <thead>
                <tr>
                  <th>Token de Usuario</th>
                  <th>Id de Usuario</th>
                  <th>Wallet Addres</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{userToken}</td>
                  <td>{userId}</td>
                  <td>{address}</td>
                </tr>
              </tbody>
            </Table>
            <hr />
          </div>
          <div className='container'>
            <h2 className='mt-top'>Subir archivo</h2>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Control type="file" onChange={changeHandler} />
            </Form.Group>
            <Button variant="light" onClick={subirArchivo}>Enviar</Button>
            <hr />
            <h2 className='mt-top'>Listado de archivos</h2>
            <Table striped bordered hover variant="dark" className='mt-top'>
              <thead>
                <tr>
                  <th>Filename</th>
                  <th>CID de archivo</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{fileName}</td>
                  <td>{cid}</td>
                  <td>{fileStatus}</td>
                </tr>
              </tbody>
            </Table>
            <Button variant="light" onClick={getDataArchivo}>Comprobar subida</Button>
          </div>
        </div>
      </div>
    </div>

  );
}

export default App;
