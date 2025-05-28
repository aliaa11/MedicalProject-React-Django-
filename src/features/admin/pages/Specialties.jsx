import { useState, useEffect } from "react";
import { FiEdit2, FiTrash2, FiPlus, FiSearch } from "react-icons/fi";
import {
  fetchSpecialties,
  createSpecialty,
  updateSpecialty,
  deleteSpecialty,
} from "../services/api";
import Table from "../components/Table";
import "../styles/tables.css";
import "../styles/forms.css";

const Specialties = () => {
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSpecialty, setCurrentSpecialty] = useState(null);
  const [formData, setFormData] = useState({ name: "" });

  useEffect(() => {
    const loadSpecialties = async () => {
      try {
        const specialtiesData = await fetchSpecialties();
        setSpecialties(specialtiesData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    loadSpecialties();
  }, []);

  const handleDelete = async (specialtyId) => {
    try {
      await deleteSpecialty(specialtyId);
      setSpecialties(specialties.filter((spec) => spec.id !== specialtyId));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (specialty) => {
    setCurrentSpecialty(specialty);
    setFormData({ name: specialty.name });
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setCurrentSpecialty(null);
    setFormData({ name: "" });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentSpecialty) {
        // Update existing specialty
        await updateSpecialty(currentSpecialty.id, formData);
        setSpecialties(
          specialties.map((spec) =>
            spec.id === currentSpecialty.id
              ? { ...spec, name: formData.name }
              : spec
          )
        );
      } else {
        // Add new specialty
        const response = await createSpecialty(formData);
        setSpecialties([...specialties, response]);
      }
      setIsModalOpen(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredSpecialties = specialties.filter((spec) =>
    spec.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="text-center py-8">Loading specialties...</div>;
  if (error)
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Specialties Management
        </h1>
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search specialties..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FiSearch className="search-icon" />
          </div>
          <button
            onClick={handleAddNew}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <FiPlus className="mr-2" />
            Add Specialty
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <Table>
        <thead>
          <tr>
            <th className="table-header-cell">ID</th>
            <th className="table-header-cell">Name</th>
            <th className="table-header-cell text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredSpecialties.map((specialty) => (
            <tr key={specialty.id} className="table-row">
              <td className="table-cell text-sm text-gray-500">
                {specialty.id}
              </td>
              <td className="table-cell text-sm font-medium text-gray-900">
                {specialty.name}
              </td>
              <td className="table-cell text-right">
                <div className="actions-cell">
                  <button
                    onClick={() => handleEdit(specialty)}
                    className="action-btn edit-btn"
                    title="Edit"
                  >
                    <FiEdit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(specialty.id)}
                    className="action-btn delete-btn"
                    title="Delete"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="p-6">
              <h2 className="modal-header">
                {currentSpecialty ? "Edit Specialty" : "Add New Specialty"}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label" htmlFor="name">
                    Specialty Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    className="form-input"
                    value={formData.name}
                    onChange={(e) => setFormData({ name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-actions">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="cancel-btn"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="submit-btn">
                    {currentSpecialty ? "Update" : "Save"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Specialties;