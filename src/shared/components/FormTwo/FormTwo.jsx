export default function FormTwo(props) {
  return (
    <>
      <label htmlFor="emergency_name">
        <input
          className="b-input b-input--name"
          type="text"
          name="emergency_name"
          id="emergency_name"
          placeholder="Nombre completo de tu contacto"
          ref={props.register({ maxLength: 50 })}
        />
      </label>

      <label htmlFor="emergency_email">
        <input
          className="b-input"
          type="email"
          name="emergency_email"
          id="emergency_email"
          placeholder="Dirección e-mail"
          ref={props.register({
            pattern: /^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
          })}
        />
      </label>

      <label htmlFor="emergency_phone">
        <input
          className="b-input"
          type="number"
          name="emergency_phone"
          id="emergency_phone"
          placeholder="Móvil"
          ref={props.register}
        />
      </label>

      <label htmlFor="insurance">
        <input
          className="b-input"
          type="text"
          name="insurance"
          id="insurance"
          placeholder="Compañía de Seguros"
          ref={props.register}
        />
      </label>

      <label htmlFor="policy">
        <input
          className="b-input"
          type="text"
          name="policy"
          id="policy"
          placeholder="Nº Póliza"
          ref={props.register}
        />
      </label>
    </>
  );
}
