import './FormOne.scss';

export default function FormOne(props) {
  return (
    <>
      <label htmlFor="image">
        <div className="b-input-image d-flex flex-column justify-content-center">
          {props.profileImage ? (
            <img className="profile-image" src={props.profileImage} alt="profile image" />
          ) : props.infoForm.image_preview ? (
            <img
              className="profile-image"
              src={props.infoForm.image_preview}
              alt="profile image 2"
            />
          ) : (
            <>
              <span className="b-icon-aqua b-icon-aqua--XL icon-camera"></span>
              <p className="b-text-btn m-0">Subir foto</p>
            </>
          )}
        </div>
        {props.profileImage && <p className="b-text-btn text-center my-0">Editar foto</p>}

        <input
          type="file"
          name="image"
          id="image"
          style={{ display: 'none' }}
          ref={props.register()}
          onChange={props.handleChange}
        />
      </label>
      <label htmlFor="name">
        <input
          className="b-input b-input--name"
          type="text"
          name="name"
          id="name"
          placeholder="Nombre completo"
          ref={props.register({ maxLength: 50 })}
        />
      </label>

      <label htmlFor="email">
        <input
          className="b-input"
          type="email"
          name="email"
          id="email"
          placeholder="Dirección e-mail"
          ref={props.register({
            required: true,
            pattern: /^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
          })}
        />
        {props.userExist && <span className="text-invalid-form">El usuario ya existe</span>}
      </label>

      <label htmlFor="phone">
        <input
          className="b-input"
          type="number"
          name="phone"
          id="phone"
          placeholder="Móvil"
          ref={props.register({ required: false })}
        />
      </label>

      <label htmlFor="password">
        <input
          className="b-input"
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          ref={
            props.fromRegister
              ? props.register({
                  required: true,
                  pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
                })
              : props.register({
                  required: false,
                  pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
                })
          }
        />
        {props.errors.password && (
          <span className="text-invalid-form">
            La contraseña debe tener mínimo 8 caracteres y al menos una mayúscula, una minúscula y
            un número
          </span>
        )}
      </label>
    </>
  );
}
