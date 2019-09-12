import React, {useState, useEffect} from 'react'
import { withFormik, Form, Field } from 'formik';
import * as yup from 'yup';
import Axios from 'axios';

const AnimalForm = ({errors, touched, status}) => {
  const [animals, setAnimals] = useState([])
  useEffect(()=>{
    if(status){
      setAnimals([...animals, status])
    }
  },[status])
  return (
    <Form>
      {touched.species && errors.species && <p className="error">{errors.species}</p>}
      <Field type="text" name="species" placeholder="Species" />
      {touched.age && errors.age && <p className="error">{errors.age}</p>}
      <Field type="number" name="age" placeholder="Age" />
      {touched.diet && errors.diet && <p className="error">{errors.diet}</p>}
      <Field component="select" name="diet">
        <option value="" disabled>Select Diet:</option>
        <option value="carnivore">Carnivore</option>
        <option value="omnivore">Omnivore</option>
        <option value="herbivore">Herbivore</option>
      </Field>
      {touched.vaccinations && errors.vaccinations && <p className="error">{errors.vaccinations}</p>}
      <label>
        <Field type="checkbox" name="vaccinations" />
        <span>Vaccinations</span>
      </label>
      {touched.notes && errors.notes && <p className="error">{errors.notes}</p>}
      <Field component="textarea" name="notes" />
      <button type="submit">Submit</button>
      {animals.map(animal =>(
        <div>Species: {animal.species}</div>
      ))}
    </Form>
  )
}

export default withFormik({
  mapPropsToValues: (values) => {
    return {
      species: values.species || '',
      age: values.age || '',
      diet: values.diet || '',
      vaccinations: values.vaccinations || false,
      notes: values.notes || ''
    }
  },
  validationSchema: yup.object().shape({
    species: yup.string().required('Species is a required field!'),
    age: yup.number().positive().required('Age is a required field!'),
    diet: yup.string().required('Diet is a required field!'),
    vaccinations: yup.boolean().oneOf([true],'Animal needs vaccination!'),
    notes: yup.string('Notes is a required field!').required()
  }),
  handleSubmit:(values, {setStatus})=>{
    Axios.post('https://reqres.in/api/animals', values)
    .then((res)=>{
      setStatus(res.data)
    })
    .catch((error)=>{
      console.log(error)
    })
  }
})(AnimalForm)
