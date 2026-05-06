import { useEffect, useState } from 'react'

function App() {
  const [usuarios, setUsuarios] = useState([])
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mensaje, setMensaje] = useState('')

  // Función para obtener la lista de usuarios
  const obtenerUsuarios = () => {
    fetch('http://localhost:4000/api/usuarios')
      .then(res => res.json())
      .then(data => setUsuarios(Array.isArray(data) ? data : []))
      .catch(err => console.error("Error al cargar usuarios:", err))
  }

  useEffect(() => {
    obtenerUsuarios()
  }, [])

  // Función para registrar un usuario
  const handleRegister = async (e) => {
    e.preventDefault()
    setMensaje('Registrando...')

    try {
      const res = await fetch('http://localhost:4000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()

      if (res.ok) {
        setMensaje('¡Usuario creado con éxito!')
        setEmail('')
        setPassword('')
        obtenerUsuarios() // Recargamos la lista automáticamente
      } else {
        setMensaje(`Error: ${data.mensaje}`)
      }
    } catch (error) {
      setMensaje('No se pudo conectar con el servidor')
    }
  }

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '500px' }}>
      <h1>Autenticación Firebase</h1>

      {/* --- FORMULARIO DE REGISTRO --- */}
      <section style={{ background: '#f4f4f4', padding: '20px', borderRadius: '8px' }}>
        <h3>Registrar Nuevo Usuario</h3>
        <form onSubmit={handleRegister}>
          <input 
            type="email" placeholder="Correo" value={email} 
            onChange={(e) => setEmail(e.target.value)} required 
            style={{ display: 'block', width: '90%', marginBottom: '10px', padding: '8px' }}
          />
          <input 
            type="password" placeholder="Contraseña" value={password} 
            onChange={(e) => setPassword(e.target.value)} required 
            style={{ display: 'block', width: '90%', marginBottom: '10px', padding: '8px' }}
          />
          <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer' }}>Registrar</button>
        </form>
        {mensaje && <p style={{ color: 'blue', fontSize: '14px' }}>{mensaje}</p>}
      </section>

      <hr style={{ margin: '40px 0' }} />

      {/* --- LISTA DE USUARIOS --- */}
      <section>
        <h3>Usuarios Registrados</h3>
        {usuarios.length === 0 ? <p>No hay usuarios o cargando...</p> : (
          <ul>
            {usuarios.map((u) => (
              <li key={u.uid} style={{ marginBottom: '5px' }}>
                <strong>{u.email}</strong> <br />
                <small style={{ color: '#666' }}>UID: {u.uid}</small>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

export default App
