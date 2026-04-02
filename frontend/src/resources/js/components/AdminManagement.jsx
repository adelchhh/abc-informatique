import React, { useState, useEffect } from 'react';

const AdminManagement = ({ token }) => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState(null);

  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`,
  });

  // Charger les admins
  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('http://localhost:8000/api/users/admins', {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erreur lors du chargement des administrateurs');
      }

      const data = await response.json();
      setAdmins(data.data || []);

      console.log(' Admins chargés:', data.data);
    } catch (err) {
      setError(err.message);
      console.error('❌ Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setSaving(true);

    try {
      if (!formData.name || !formData.email || !formData.password) {
        throw new Error('Tous les champs sont obligatoires');
      }

      if (formData.password !== formData.password_confirmation) {
        throw new Error('Les mots de passe ne correspondent pas');
      }

      if (formData.password.length < 8) {
        throw new Error('Le mot de passe doit contenir au moins 8 caractères');
      }

      const response = await fetch('http://localhost:8000/api/users/create-admin', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          password_confirmation: formData.password_confirmation,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errors = data.errors || {};
        const errorMessages = Object.values(errors)
          .flat()
          .join(', ');
        throw new Error(errorMessages || data.message || 'Erreur serveur');
      }

      alert(` Admin "${data.data.name}" créé avec succès!`);
      setFormData({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
      });
      setShowForm(false);
      fetchAdmins(); // Actualiser la liste
    } catch (err) {
      setFormError(err.message);
      console.error('❌ Erreur:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAdmin = async (adminId, adminName) => {
    if (!window.confirm(` Êtes-vous sûr de vouloir supprimer l'admin "${adminName}"?\n\nCette action est irréversible!`)) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/users/${adminId}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la suppression');
      }

      alert(` Admin supprimé avec succès`);
      fetchAdmins();
    } catch (err) {
      alert(` Erreur: ${err.message}`);
      console.error('❌ Erreur:', err);
    }
  };

  const getRoleBadge = (role) => {
    if (role === 'super_admin') {
      return 'bg-purple-100 text-purple-800 border border-purple-300';
    }
    return 'bg-blue-100 text-blue-800 border border-blue-300';
  };

  const getRoleLabel = (role) => {
    return role === 'super_admin' ? 'Super Admin' : 'Admin';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900"> Gestion des Administrateurs</h2>
          <p className="text-sm text-gray-600 mt-1">Gérez les comptes administrateurs</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition-colors flex items-center gap-2"
        >
           Ajouter un Admin
        </button>
      </div>

      {/* Formulaire d'ajout */}
      {showForm && (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border-2 border-green-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4"> Créer un nouvel administrateur</h3>

          {formError && (
            <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
              <div className="flex gap-3">
                <span className="text-red-600 text-xl"> </span>
                <p className="text-red-800 font-semibold">{formError}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Nom complet</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Jean Dupont"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@exemple.tn"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Mot de passe</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min. 8 caractères"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Confirmer le mot de passe</label>
                <input
                  type="password"
                  name="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  placeholder="Répéter le mot de passe"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={saving}
                className={`px-6 py-3 rounded-lg font-bold text-white transition-all flex items-center gap-2 ${
                  saving
                    ? 'bg-green-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 active:scale-95'
                }`}
              >
                {saving ? (
                  <>
                    <span className="animate-spin">·</span> Création...
                  </>
                ) : (
                  <>
                    <span> </span> Créer l'admin
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 font-bold transition-colors"
              >
                ← Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Liste des admins */}
      {loading ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <div className="inline-flex items-center justify-center">
            <div className="h-12 w-12 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">Chargement des administrateurs...</p>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
          <p className="text-red-800 font-semibold"> {error}</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100">
          {admins.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-3xl mb-3"> </p>
              <p className="text-gray-600 font-medium">Aucun administrateur</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">ID</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Nom</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Rôle</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Date d'ajout</th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {admins.map((admin) => (
                    <tr key={admin.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-bold text-blue-700">#{admin.id}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">{admin.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-700 font-mono">{admin.email}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getRoleBadge(admin.role)}`}>
                          {getRoleLabel(admin.role)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(admin.created_at).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {admin.role === 'super_admin' ? (
                          <span className="text-gray-400 text-xs font-semibold">—</span>
                        ) : (
                          <button
                            onClick={() => handleDeleteAdmin(admin.id, admin.name)}
                            className="px-3 py-2 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition-colors"
                            title="Supprimer cet administrateur"
                          >
                             Supprimer
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminManagement;
