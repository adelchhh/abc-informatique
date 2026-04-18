import React, { useState, useEffect } from 'react';

const OrderList = ({ orders, onSelectOrder, onRefresh, filterStatus }) => {
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'en_attente':
        return 'bg-yellow-100 text-yellow-800 border-l-4 border-yellow-400';
      case 'confirmé':
        return 'bg-blue-100 text-blue-800 border-l-4 border-blue-400';
      case 'livré':
        return 'bg-green-100 text-green-800 border-l-4 border-green-400';
      default:
        return 'bg-gray-100 text-gray-800 border-l-4 border-gray-400';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'en_attente':
        return 'En attente';
      case 'confirmé':
        return 'OK Confirmé';
      case 'livré':
        return ' Livré';
      default:
        return status;
    }
  };

  const filteredOrders = filterStatus
    ? orders.filter((order) => order.statut === filterStatus)
    : orders;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="px-6 py-5 bg-gradient-to-r from-gray-50 to-blue-50 border-b-2 border-gray-100 flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            Commandes ({filteredOrders.length})
          </h3>
          <p className="text-sm text-gray-600 mt-1">Cliquez sur une commande pour plus de détails</p>
        </div>
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 font-semibold transition-colors flex items-center gap-2"
        >
           Rafraîchir
        </button>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="p-12 text-center">
          <p className="text-3xl mb-3"> </p>
          <p className="text-gray-600 font-medium">Aucune commande trouvée</p>
          <p className="text-sm text-gray-500 mt-1">Les commandes apparaîtront ici</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b-2 border-gray-200 sticky top-0">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">ID</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">Client</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">Produit</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">Téléphone</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">Statut</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">Prix</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">Date</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map((order, index) => (
                <tr
                  key={order.id}
                  className="hover:bg-blue-50 transition-colors cursor-pointer border-l-4 border-transparent hover:border-blue-500 animate-fade-in"
                  style={{ animationDelay: `${index * 0.02}s` }}
                  onClick={() => onSelectOrder(order)}
                >
                  <td className="px-6 py-4 text-sm font-bold text-blue-700">#{order.id}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{order.nom}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{order.product_name}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 font-mono">{order.telephone}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadgeColor(order.statut)}`}>
                      {getStatusLabel(order.statut)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-blue-600">
                    {Number(order.product_price ?? 0).toFixed(2)} DA
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(order.created_at).toLocaleDateString('fr-FR', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectOrder(order);
                      }}
                      className="px-3 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Détails
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderList;
