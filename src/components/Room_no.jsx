import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import firebaseDB from "../firebase";

const Room_no = () => {
  const [rooms, setRooms] = useState({});

  const roomCategories = [
    "G1",
    "G2",
    "A1",
    "A2",
    "A3",
    "A4",
    "A5",
    "A6",
    "A7",
    "B1",
    "B2",
    "B3",
    "B4",
    "B5",
    "B6",
    "C1",
    "C2",
    "C3",
    "C4",
  ];

  useEffect(() => {
    const fetchData = async () => {
      const roomData = {};

      for (const category of roomCategories) {
        const snapshot = await firebaseDB.child(category).once("value");
        const data = snapshot.val();
        if (data) {
          roomData[category] = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
        } else {
          roomData[category] = [];
        }
      }

      setRooms(roomData);
    };

    fetchData();
  }, []);

  const getIconColorClass = (status) => {
    switch (status) {
      case "Joined":
        return "text-success"; // Green for joined
      case "Vacated":
        return "text-danger"; // Red for vacated
      case "Under Maintenance":
        return "text-warning"; // Yellow for under maintenance
      default:
        return "text-secondary"; // Default color
    }
  };

  const RoomCategory = ({ category }) => (
    <div className="col-12 col-md-3">
      <div className="p-3">
        <div className="card shadow-lg mb-5 bg-body rounded border-0">
          <div className="card-body">
            <Link
              to={`/${category.toLowerCase()}`}
              style={{ textDecoration: "none" }}
            >
              <h5>{category}</h5>

              <div className="d-flex flex-nowrap overflow-auto mb-3">
                {(rooms[category] || []).map((bed) => (
                  <i
                    key={bed.id}
                    className={`material-icons ${getIconColorClass(
                      bed.status
                    )} mx-1 my-1`}
                    title={`Room ${bed.room_number}: ${bed.status}`}
                    style={{ fontSize: "24px" }} // Adjust icon size as needed
                  >
                    localhotel
                  </i>
                ))}
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mb-5">
      <div className="row g-3">
        {roomCategories.map((category) => (
          <RoomCategory key={category} category={category} />
        ))}
      </div>
    </div>
  );
};

export default Room_no;
