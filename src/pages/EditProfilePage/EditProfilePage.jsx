import { Link, Redirect, useHistory } from 'react-router-dom';
import './EditProfilePage.scss';

import { useContext, useEffect, useState } from 'react';
import { getUserProfile, editUser, deleteUser } from '../../shared/services/user';
import { useForm } from 'react-hook-form';
import { getAllergens } from '../../shared/services/allergens';
import { clusterAllergensByFirstLetter } from '../../shared/blocks/clusterAllergensByFirstLetter';
import { convertArrayToObject } from '../../shared/blocks/convertArrayToObject';
import FormOne from '../../shared/components/FormOne/FormOne';
import FormTwo from '../../shared/components/FormTwo/FormTwo';
import FormThree from '../../shared/components/FormThree/FormThree';
import { AuthContext } from '../../shared/context/AuthContext';
import Loader from 'react-loader-spinner';
import { Dialog } from 'primereact/dialog';

let allergenNames = [];
let allAllergensRaw = [];

export default function EditProfilePage() {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const { user, setUser } = useContext(AuthContext);
  const [allAllergens, setAllAllergens] = useState(null);

  const { register, handleSubmit, reset, errors, getValues } = useForm();

  useEffect(() => {
    setProfileImage(user.image);
    getAllergens().then((res) => {
      allAllergensRaw = res.data;
      allergenNames = allAllergensRaw.map((x) => x.name);
      setAllAllergens(clusterAllergensByFirstLetter(allAllergensRaw));
    });
  }, []);
  const [profileImage, setProfileImage] = useState(null);
  const handleChange = (e) => {
    if (e.target.files[0]) {
      setProfileImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  let userAllergensIds = [];
  if (user) {
    userAllergensIds = user.allergens.map((allergen) => allergen._id);
  }
  useEffect(() => {
    if (user && user.allergens) {
      const userObj = {
        image: null,
        name: user.name,
        email: user.email,
        phone: user.phone,
        emergency_name: user.emergencyContact.name,
        emergency_email: user.emergencyContact.email,
        emergency_phone: user.emergencyContact.phone,
        policy: user.emergencyContact.insurance.policy,
        insurance: user.emergencyContact.insurance.company,
      };
      const userAllergenObj = convertArrayToObject(
        allAllergensRaw,
        'name',
        '_id',
        userAllergensIds,
      );
      reset({ ...userObj, ...userAllergenObj });
    }
  }, [user, allAllergens]);

  const onSubmit = (data) => {
    let AllergensArr = Object.keys(data)
      .filter((key) => allergenNames.includes(key))
      .reduce((obj, key) => {
        obj[key] = data[key];
        return obj;
      }, {});
    const allergensToSubmit = Object.values(AllergensArr).filter((values) => values);
    const payload = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: data.password,
      allergens: allergensToSubmit,
      emergency_name: data.emergency_name,
      emergency_phone: data.emergency_phone,
      emergency_email: data.emergency_email,
      company: data.insurance,
      policy: data.policy,
    };

    const formData = new FormData();
    formData.append('form', JSON.stringify(payload));
    formData.append('image', data.image[0]);
    formData.append('id', JSON.stringify(user._id)); //esto esta mal no? pasar el id a mano

    setLoading(true);
    editUser(formData).then((data) => {
      setUser(data.data);
      setLoading(false);
      history.push('/home');
    });
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <Loader type="Puff" color="#00BFFF" height={100} width={100} timeout={3000} />
      </div>
    );
  }

  // redirect to login if user is deleted
  if (!user) {
    return <Redirect to="/login" />;
  }

  const footer = (
    <div>
      <button
        className="yes-button mx-1"
        onClick={() =>
          deleteUser().then(() => {
            setUser(null);
          })
        }
      >
        Si
      </button>
      <button className="no-button mx-1" onClick={() => setShowDialog(false)}>
        No
      </button>
    </div>
  );

  return (
    <>
      <div className="mx-3 mt-4">
        <div className="d-flex justify-content-start mb-2">
          <Link to="/login" style={{ textDecoration: 'inherit' }}>
            <p className="b-text-btn d-flex align-items-center m-0">
              <span className="b-icon-aqua icon-left-arrow mr-2"></span>Volver
            </p>
          </Link>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <h3>Datos del usuario</h3>

          <FormOne
            register={register}
            errors={errors}
            profileImage={profileImage}
            infoForm={user}
            handleChange={handleChange}
          />
          <h3 className="mt-4">Contacto de emergencia</h3>
          <FormTwo register={register} />
          <h3 className="mt-4">Alérgenos</h3>

          {allAllergens && (
            <FormThree
              allergens={allAllergens}
              userAllergens={userAllergensIds}
              getValues={getValues}
              register={register}
            />
          )}
          <button className="b-btn mt-4">Guardar</button>
        </form>
        <button className="b-btn b-btn--warning mt-2 mb-3" onClick={() => setShowDialog(true)}>
          Eliminar cuenta
        </button>
      </div>
      <Dialog
        className="b-primereact-dialog"
        maskClassName="b-primereact-dialog-mask"
        header="Eliminar cuenta"
        visible={showDialog}
        footer={footer}
        blockScroll={true}
        baseZIndex={10}
        dismissableMask={true}
        onHide={() => setShowDialog(false)}
      >
        {/* <label htmlFor="password">Escribe tu contraseña:</label>
        <input type="password" name="password" id="password" />
        <br />
        <br /> */}
        ¿Estás seguro de que quieres eliminar tu cuenta?
      </Dialog>
    </>
  );
}
