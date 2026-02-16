import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="container">
      <header>
        <h1>🚗 PilotaJá</h1>
        <p>Encontre o instrutor de direção ideal para você</p>
      </header>

      <main>
        <section className="hero">
          <h2>Aprenda a dirigir com os melhores instrutores</h2>
          <p>
            Conectamos você a instrutores autônomos qualificados na sua região.
            Agende aulas no horário que preferir.
          </p>
          <Link to="/instructors" className="btn-primary">
            Encontrar Instrutor
          </Link>
        </section>

        <section className="features">
          <div className="feature">
            <span className="icon">📍</span>
            <h3>Perto de você</h3>
            <p>Instrutores na sua região</p>
          </div>
          <div className="feature">
            <span className="icon">⭐</span>
            <h3>Avaliados</h3>
            <p>Veja notas e comentários</p>
          </div>
          <div className="feature">
            <span className="icon">📅</span>
            <h3>Flexível</h3>
            <p>Agende no seu horário</p>
          </div>
        </section>
      </main>
    </div>
  );
}
