import { useEffect, useState } from "react";
import firebaseDB from "../../firebase";
import { v4 } from "uuid";
import { imgDB } from "../../firebase";
import { useNavigate } from "react-router-dom";

import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

function Bfour() {
  const [getData, setGetData] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [data1, setData1] = useState({
    date: "",
    name: "",
    adhar_num: "",
    mobile_num: "",
    status: "",
    room_number: "",
    floor_number: "",
    price: "",
    student_img: "",
    due_date: "",
  });

  const [img, setImg] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    const fetchData = () => {
      firebaseDB.child("B4").on("value", (details) => {
        if (details.val()) {
          setGetData(details.val());
        }
      });
    };

    fetchData();

    // Cleanup subscription on unmount
    return () => firebaseDB.child("B4").off();
  }, []);
  const handleFileUpload = async (file) => {
    if (!file) return;
    const imgRef = ref(imgDB, `file/${v4()}`);
    await uploadBytes(imgRef, file);
    const url = await getDownloadURL(imgRef);
    return url;
  };

  const [error, setError] = useState({
    adhar: "",
    mobile: "",
  });
  const aadhaarPattern = /^\d{12}$/;
  const mobilePattern = /^[6-9]\d{9}$/; // Indian mobile numbers starting with 6, 7, 8, or 9

  const submitHandler = async (e) => {
    e.preventDefault();

    // Validate Aadhaar Number
    if (data1.adhar_num.trim() === "") {
      setError({ ...error, adhar: "Enter Aadhaar Number" });
      return;
    } else if (!aadhaarPattern.test(data1.adhar_num)) {
      setError({ ...error, adhar: "Enter valid Aadhaar Number" });
      return;
    } else {
      setError({ ...error, adhar: "" });
    }

    // Validate Mobile Number
    if (data1.mobile_num.trim() === "") {
      setError({ ...error, mobile: "Enter Mobile Number" });
      return;
    } else if (!mobilePattern.test(data1.mobile_num)) {
      setError({ ...error, mobile: "Enter valid Mobile Number" });
      return;
    } else {
      setError({ ...error, mobile: "" });
    }

    try {
      const snapshot = await firebaseDB.child("B4").get();
      if (snapshot.exists() && Object.keys(snapshot.val()).length >= 4) {
        alert(
          "You cannot add more than 4 records. because this room contains 4 Beds only so please check the Beds."
        );
        return;
      }

      const url = await handleFileUpload(img);
      const formDataWithImgUrl = { ...data1, student_img: url };
      await firebaseDB.child("B4").push(formDataWithImgUrl);
      alert("Data saved successfully!");

      // Clear form fields and state after successful submission
      setData1({
        date: "",
        name: "",
        adhar_num: "",
        mobile_num: "",
        status: "",
        room_number: "",
        floor_number: "",
        price: "",
        student_img: "",
      });
      setImg(null);
    } catch (error) {
      console.error("Error saving data:", error);
      // Handle error as needed (e.g., show error message)
    }
  };
  const submitEditHandler = async (e) => {
    e.preventDefault();

    if (data1.adhar_num.trim() === "") {
      setError({ ...error, adhar: "Enter Aadhaar Number" });
      return;
    } else if (!aadhaarPattern.test(data1.adhar_num)) {
      setError({ ...error, adhar: "Enter valid Aadhaar Number" });
      return;
    } else {
      setError({ ...error, adhar: "" });
    }

    if (data1.mobile_num.trim() === "") {
      setError({ ...error, mobile: "Enter Mobile Number" });
      return;
    } else if (!mobilePattern.test(data1.mobile_num)) {
      setError({ ...error, mobile: "Enter valid Mobile Number" });
      return;
    } else {
      setError({ ...error, mobile: "" });
    }

    try {
      let updatedData = { ...data1 };
      if (img) {
        const url = await handleFileUpload(img);
        updatedData.student_img = url;
      }

      await firebaseDB.child(`B4/${selectedRecord}`).update(updatedData);
      alert("Data updated successfully!");

      // Clear form fields and state after successful submission
      setData1({
        date: "",
        name: "",
        adhar_num: "",
        mobile_num: "",
        status: "",
        room_number: "",
        floor_number: "",
        price: "",
        student_img: "",
      });
      setSelectedRecord(null);
      setImg(null);
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const handleEditButtonClick = (key) => {
    setSelectedRecord(key);
    setData1(getData[key]);
  };
  const handleDeleteButtonClick = (key) => {
    if (window.confirm("Do you want to delete?")) {
      try {
        firebaseDB.child(`B4/${key}`).remove();
        alert("Row deleted successfully!");
      } catch (error) {
        console.error("Error deleting row:", error);
      }
    }
  };
  const calculateDueDate = (dateOfJoin) => {
    // Assuming due date is 7 days after the date of join
    const dueDate = new Date(dateOfJoin);
    dueDate.setDate(dueDate.getDate() + 30); // Adjust as needed

    return dueDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD
  };
  const changeHandler = (e) => {
    const { name, value } = e.target;

    if (name === "date") {
      setData1({
        ...data1,
        [name]: value,
        due_date: calculateDueDate(value), // Calculate due date when 'date' changes
      });
    } else {
      setData1({ ...data1, [name]: value });
    }
  };
  const handleFilter = (event) => {
    setSearchQuery(event.target.value);
  };
  const today = new Date();
  const dueDate = new Date(data1.due_date);
  const differenceInDays = Math.floor(
    (dueDate - today) / (1000 * 60 * 60 * 24)
  );

  let badgeClass = "badge bg-success"; // Default badge color for due date

  // Change badge color based on days difference
  if (differenceInDays < 3) {
    badgeClass = "badge bg-danger"; // Red color for near due dates
  }
  // Filter the data based on the search query
  const filteredData = Object.keys(getData).filter((key) => {
    const item = getData[key];
    return (
      item.room_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.floor_number.toString().includes(searchQuery) ||
      item.price.toString().includes(searchQuery)
    );
  });

  return (
    <div className="container mt-3">
      <div className="row justify-content-end p-4">
        <div className="col-auto">
          <button
            type="button"
            className="btn badge text-bg-primary me-2"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
          >
            Add Tenent
          </button>
        </div>
        <div className="col-auto">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
        </div>
      </div>
      <div className="col-6 mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search"
          onChange={handleFilter}
        />
      </div>
      <div className="container">
        <div className="row">
          {filteredData &&
            filteredData.map((key) => {
              const item = getData[key];
              return (
                <div className="col-sm-6 col-md-4" key={key}>
                  <div className="card shadow-lg mb-5 bg-body rounded border-0">
                    <img
                      src={item.student_img}
                      className="card-img-top fixed-size-img"
                      style={{
                        height: "30vh",
                        width: "30vh",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        objectFit: "cover",
                        margin: "auto",
                      }}
                      alt="Room"
                    />
                    <div className="card-body">
                      {/* <p className="card-text text-bold">
                      a single-share room offers more privacy and personal
                      space. It typically includes a single bed, desk, and
                      storage for personal belongings.
                    </p> */}

                      <ul className="list-group list-group-flush">
                        <li className="list-group-item">
                          Tenant Name:
                          <span className="badge bg-secondary">
                            {item.name}
                          </span>
                        </li>
                        <li className="list-group-item">
                          Adhar Number:
                          <span className="badge bg-info">
                            {item.adhar_num}
                          </span>
                        </li>
                        <li className="list-group-item">
                          Mobile Number:
                          <span className="badge bg-light text-dark">
                            <a href={`tel:+91${item.mobile_num}`}>
                              +91 {item.mobile_num}
                            </a>
                            {" | "}
                            <a
                              href={`https://wa.me/91${item.mobile_num}?text=Hello%20${item.name},%20I%20would%20like%20to%20discuss%20your%20room%20details.%20Please%20pay%20the%20room%20rent.`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              WhatsApp
                            </a>
                          </span>
                        </li>

                        <li className="list-group-item">
                          Room Number:
                          <span className="badge bg-primary">
                            {item.room_number}
                          </span>
                        </li>
                        <li className="list-group-item">
                          Status:
                          <span
                            className={`badge ${
                              item.status === "Joined"
                                ? "text-bg-success"
                                : item.status === "Vacated"
                                ? "text-bg-danger"
                                : item.status === "Under Maintenance"
                                ? "text-bg-warning"
                                : ""
                            }`}
                          >
                            {item.status}
                          </span>
                        </li>

                        <li className="list-group-item">
                          Floor:
                          <span className="badge bg-warning">
                            {item.floor_number}
                          </span>
                        </li>
                        <li className="list-group-item">
                          Price:
                          <span className="badge bg-primary">
                            ${item.price}
                          </span>
                        </li>
                        <li className="list-group-item">
                          Joining Date:
                          <span className="badge bg-info">{item.date}</span>
                        </li>
                        <li className="list-group-item">
                          Due Date:
                          <span className={badgeClass}>{item.due_date}</span>
                        </li>
                      </ul>
                      <div className="card-body">
                        <button
                          className="btn badge text-bg-primary ms-2"
                          data-bs-toggle="modal"
                          data-bs-target="#exampleModal1"
                          onClick={() => handleEditButtonClick(key)}
                        >
                          <i className="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button
                          className="btn badge text-bg-danger "
                          onClick={() => handleDeleteButtonClick(key)}
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      <div
        className="modal fade"
        id="exampleModal"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Add Tenent
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={submitHandler}>
                <div className="col-md-4">
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="date"
                    value={data1.date}
                    onChange={changeHandler}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Student_name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={data1.name}
                    onChange={changeHandler}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Adhar_num</label>
                  <input
                    type="text"
                    className="form-control"
                    id="adhar_num"
                    name="adhar_num"
                    value={data1.adhar_num}
                    onChange={changeHandler}
                    required
                  />
                  {error.adhar && (
                    <span className="text-danger">{error.adhar}</span>
                  )}
                </div>
                <div className="col-md-4">
                  <label className="form-label">Mobile_num</label>
                  <input
                    type="text"
                    className="form-control"
                    name="mobile_num"
                    value={data1.mobile_num}
                    onChange={changeHandler}
                    required
                  />
                  {error.mobile && (
                    <span className="text-danger">{error.mobile}</span>
                  )}
                </div>
                <div className="col-md-4">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    name="status"
                    value={data1.status}
                    onChange={changeHandler}
                    required
                  >
                    <option value="" disabled>
                      Choose...
                    </option>
                    <option className="badge text-bg-success" value="Joined">
                      Joined
                    </option>
                    <option className="badge text-bg-danger" value="Vacated">
                      Vacated
                    </option>
                    <option
                      className="badge text-bg-warning"
                      value="Under Maintenance"
                    >
                      Under Maintenance
                    </option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Room Number</label>
                  <input
                    type="text"
                    className="form-control"
                    name="room_number"
                    value={data1.room_number}
                    onChange={changeHandler}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Floor</label>
                  <input
                    type="text"
                    className="form-control"
                    name="floor_number"
                    value={data1.floor_number}
                    onChange={changeHandler}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Price</label>
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input
                      type="number"
                      className="form-control"
                      name="price"
                      value={data1.price}
                      onChange={changeHandler}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>
                </div>
                {/* <div className="col-md-4">
                  <label className="form-label">Git Colab</label>
                  <input
                    type="text"
                    className="form-control"
                    name="student_img"
                    value={data1.student_img}
                    onChange={changeHandler}
                    required
                  />
                </div> */}
                <div className="col-md-4">
                  <label className="form-label">Tenent</label>
                  <input
                    type="file"
                    name="student_img"
                    onChange={(e) => setImg(e.target.files[0])}
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade"
        id="exampleModal1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Edit PG Students Record
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={submitEditHandler}>
                <div className="mb-3">
                  <label htmlFor="date" className="form-label">
                    Date
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="date"
                    name="date"
                    value={data1.date}
                    onChange={changeHandler}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Student Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={data1.name}
                    onChange={changeHandler}
                    required
                  />
                </div>
                <div className="row">
                  <div className="col-md-4">
                    <label htmlFor="adhar_num" className="form-label">
                      Aadhaar Number
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="adhar_num"
                      name="adhar_num"
                      value={data1.adhar_num}
                      onChange={changeHandler}
                      required
                    />
                    {error.adhar && (
                      <span className="text-danger">{error.adhar}</span>
                    )}
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="mobile_num" className="form-label">
                      Mobile Number
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="mobile_num"
                      name="mobile_num"
                      value={data1.mobile_num}
                      onChange={changeHandler}
                      required
                    />
                    {error.mobile && (
                      <span className="text-danger">{error.mobile}</span>
                    )}
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="status" className="form-label">
                      Status
                    </label>
                    <select
                      className="form-select"
                      id="status"
                      name="status"
                      value={data1.status}
                      onChange={changeHandler}
                      required
                    >
                      <option value="" disabled>
                        Choose...
                      </option>
                      <option value="Joined" className="badge text-bg-success">
                        Joined
                      </option>
                      <option value="Vacated" className="badge text-bg-danger">
                        Vacated
                      </option>
                      <option
                        value="Under Maintenance"
                        className="badge text-bg-warning"
                      >
                        Under Maintenance
                      </option>
                    </select>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-4">
                    <label htmlFor="room_number" className="form-label">
                      Room Number
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="room_number"
                      name="room_number"
                      value={data1.room_number}
                      onChange={changeHandler}
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="floor_number" className="form-label">
                      Floor Number
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="floor_number"
                      name="floor_number"
                      value={data1.floor_number}
                      onChange={changeHandler}
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="price" className="form-label">
                      Price
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="price"
                      name="price"
                      value={data1.price}
                      onChange={changeHandler}
                      required
                    />
                  </div>
                </div>

                <div className="col-md-4">
                  <label className="form-label">Tenent</label>
                  <input
                    type="file"
                    name="student_img"
                    onChange={(e) => setImg(e.target.files[0])}
                  />
                </div>

                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Bfour;
