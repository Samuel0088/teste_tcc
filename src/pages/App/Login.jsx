import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { auth } from "../../services/firebase"
import { signInWithEmailAndPassword } from "firebase/auth"
import { FaEye, FaEyeSlash, FaMicrosoft } from "react-icons/fa"
import { FcGoogle } from "react-icons/fc"
import "../../styles/App/Login.css"

export default function Login({ setAppLoading }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [alertMessage, setAlertMessage] = useState({ type: "", text: "" })
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // ✅ VERIFICA SE JÁ ESTÁ LOGADO AO CARREGAR A PÁGINA
  useEffect(() => {
    const checkAuth = async () => {
      // Verifica se tem usuário logado
      const user = auth.currentUser;
      
      if (user) {
        console.log("Usuário já está logado:", user.email);
        
        // Se estiver logado, ativa splash e redireciona
        setAppLoading(true);
        
        setTimeout(() => {
          navigate("/home");
        }, 2000);
      } else {
        // Se não estiver logado, verifica se tem email lembrado
        const rememberedEmail = localStorage.getItem("rememberedEmail");
        if (rememberedEmail) {
          setEmail(rememberedEmail);
          setRememberMe(true);
        }
      }
    };

    checkAuth();
  }, [navigate, setAppLoading]); // Dependências

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleLogin = async () => {
    if (!email || !password) {
      setAlertMessage({ 
        type: "error", 
        text: "Preencha todos os campos para acessar sua conta." 
      })
      return
    }

    setLoading(true)
    setAlertMessage({ type: "", text: "" })

    try {
      await signInWithEmailAndPassword(auth, email, password)

      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email)
      } else {
        localStorage.removeItem("rememberedEmail")
      }

      setAlertMessage({ 
        type: "success", 
        text: "Bem-vindo de volta."
      })

      // 🔥 ATIVA A SPLASH
      setAppLoading(true)

      // Aguarda splash terminar
      setTimeout(() => {
        navigate("/home")
      }, 2000)

    } catch (error) {
      let errorMessage = "Erro na autenticação. Verifique seus dados."

      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = "Usuário não encontrado. Crie uma conta para começar."
          break
        case 'auth/wrong-password':
          errorMessage = "Senha incorreta. Verifique e tente novamente."
          break
        case 'auth/invalid-email':
          errorMessage = "Email inválido. Digite um email válido."
          break
        case 'auth/too-many-requests':
          errorMessage = "Muitas tentativas. Aguarde um momento para tentar novamente."
          break
        case 'auth/network-request-failed':
          errorMessage = "Erro de conexão. Verifique sua internet."
          break
        default:
          errorMessage = "Erro ao fazer login. Tente novamente mais tarde."
      }

      setAlertMessage({ type: "error", text: errorMessage })
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin()
    }
  }

  return (
    <div className="login-container">
      <section className="login-hero">
        <div className="login-hero-overlay"></div>
        <img className="login-logo" src="/assets/image/Logo.png" alt="Zenith" />
        <div className="login-hero-copy">
          <p>Gestão rural inteligente</p>
          <h1>Entrar</h1>
        </div>
      </section>

      <section className="login-panel">
        <div className="login-curve"></div>
        <div className="login-side-text">Precisão agrícola para sua fazenda.</div>
        <div className="login-bottom-shape"></div>

        <div className="login-form">
          <div className="input-group-login">
            <label>Email</label>
            <input
              type="email"
              placeholder="seuemail@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
            />
          </div>

          <div className="input-group-login">
            <label>Senha</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Sua senha"
                disabled={loading}
              />
              <button 
                type="button"
                onClick={togglePasswordVisibility}
                className="password-toggle-btn"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? <FaEye style={{color: '#56a870'}} /> : <FaEyeSlash style={{color: '#56a870'}} />}
              </button>
            </div>
          </div>

          <div className="login-options">
            <label className="remember-me">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Lembrar de mim</span>
            </label>
            <a href="/forgot-password" className="forgot-password">
              Esqueceu a senha?
            </a>
          </div>

          {alertMessage.text && (
            <div className={`alert-message-login ${alertMessage.type}`}>
              {alertMessage.text}
            </div>
          )}

          <button
            className="login-button"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading-spinner-login"></span>
                Entrando...
              </>
            ) : (
              "Entrar na conta"
            )}
          </button>
        </div>

        <div className="login-divider">
          <span>Ou</span>
        </div>

        <div className="register-link">
          <span>Primeira vez aqui?</span>
          <a href="/register">Criar conta</a>
        </div>

        <div className="social-login">
          <button type="button" className="social-login-btn">
            <span className="social-icon google"><FcGoogle /></span>
            Entre com Google
          </button>
          <button type="button" className="social-login-btn">
            <span className="social-icon outlook"><FaMicrosoft /></span>
            Entre com Outlook
          </button>
        </div>
      </section>
    </div>
  )
}
