"use client";

import React, { useState, useTransition } from "react";
import { updateUserRoleAction, deleteUserAction } from "@/actions/user";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Users,
  ShieldCheck,
  Building,
  UserCheck,
  Search,
  Trash2,
  Edit2,
  Calendar,
  MessageSquare,
  AlertTriangle,
  X,
  Check,
} from "lucide-react";

interface UserItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "CUSTOMER" | "HOTEL_MANAGER" | "ADMIN";
  createdAt: string;
  reservationsCount: number;
  reviewsCount: number;
  managedHotels: { id: string; name: string }[];
}

export function AdminUserManager({
  currentUserId,
  users,
}: {
  currentUserId: string;
  users: UserItem[];
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<string>("ALL");

  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [targetRole, setTargetRole] = useState<string>("CUSTOMER");

  const [deletingUser, setDeletingUser] = useState<UserItem | null>(null);

  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.phone.includes(searchTerm);

    if (filterRole === "ALL") return matchesSearch;
    return matchesSearch && u.role === filterRole;
  });

  const handleUpdateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    setMessage(null);
    startTransition(async () => {
      const res = await updateUserRoleAction(selectedUser.id, targetRole);
      if (res.success) {
        setMessage({ type: "success", text: res.message });
        setSelectedUser(null);
      } else {
        setMessage({ type: "error", text: res.message });
      }
    });
  };

  const handleDeleteUser = async () => {
    if (!deletingUser) return;

    setMessage(null);
    startTransition(async () => {
      const res = await deleteUserAction(deletingUser.id);
      if (res.success) {
        setMessage({ type: "success", text: res.message });
        setDeletingUser(null);
      } else {
        setMessage({ type: "error", text: res.message });
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Alert Notification */}
      {message && (
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between text-xs font-medium ${
            message.type === "success"
              ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-400"
              : "bg-rose-950/40 border-rose-500/30 text-rose-400"
          }`}
        >
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} className="hover:opacity-80">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Control Bar: Search & Filter Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par nom, email ou téléphone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: "ALL", label: `Tous (${users.length})` },
            { id: "CUSTOMER", label: `Clients (${users.filter((u) => u.role === "CUSTOMER").length})` },
            { id: "HOTEL_MANAGER", label: `Gestionnaires (${users.filter((u) => u.role === "HOTEL_MANAGER").length})` },
            { id: "ADMIN", label: `Admins (${users.filter((u) => u.role === "ADMIN").length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterRole(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                filterRole === tab.id
                  ? "bg-amber-500 text-slate-950 font-bold"
                  : "bg-slate-950 text-slate-400 border border-slate-800 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* User Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredUsers.map((user) => {
          const isSelf = user.id === currentUserId;

          return (
            <div
              key={user.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-sm shrink-0">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-white">{user.name}</h3>
                        {isSelf && (
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                            Vous
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400">{user.email}</p>
                    </div>
                  </div>

                  <Badge
                    variant={
                      user.role === "ADMIN"
                        ? "danger"
                        : user.role === "HOTEL_MANAGER"
                        ? "warning"
                        : "default"
                    }
                  >
                    {user.role === "ADMIN"
                      ? "ADMIN"
                      : user.role === "HOTEL_MANAGER"
                      ? "GESTIONNAIRE"
                      : "CLIENT"}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Téléphone</span>
                    <span className="text-slate-300 font-medium">{user.phone}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 block">Inscrit le</span>
                    <span className="text-slate-300 font-medium">
                      {new Date(user.createdAt).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                </div>

                {/* Additional Metadata / Managed Hotels */}
                {user.role === "HOTEL_MANAGER" && user.managedHotels.length > 0 && (
                  <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 text-xs">
                    <span className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider block mb-1">
                      Établissement(s) géré(s) :
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {user.managedHotels.map((h) => (
                        <span
                          key={h.id}
                          className="bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded-md text-[11px]"
                        >
                          {h.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <strong>{user.reservationsCount}</strong> réservation(s)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                    <strong>{user.reviewsCount}</strong> avis
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isSelf}
                  onClick={() => {
                    setSelectedUser(user);
                    setTargetRole(user.role);
                  }}
                  className="flex items-center gap-1 text-xs"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Modifier Rôle
                </Button>

                <Button
                  variant="danger"
                  size="sm"
                  disabled={isSelf || isPending}
                  onClick={() => setDeletingUser(user)}
                  className="flex items-center gap-1 text-xs"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Supprimer
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredUsers.length === 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400 text-xs">
          Aucun utilisateur ne correspond à votre recherche.
        </div>
      )}

      {/* Modal Changement de Rôle */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Changer le rôle d&apos;accès</h3>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Modifiez le niveau d&apos;habilitation pour{" "}
              <strong className="text-white">{selectedUser.name}</strong> ({selectedUser.email}).
            </p>

            <form onSubmit={handleUpdateRole} className="space-y-4 text-xs">
              <div className="space-y-2">
                {[
                  {
                    id: "CUSTOMER",
                    title: "Client (CUSTOMER)",
                    desc: "Accès standard : réservation de chambres, favoris, avis.",
                  },
                  {
                    id: "HOTEL_MANAGER",
                    title: "Gestionnaire (HOTEL_MANAGER)",
                    desc: "Accès restreint à la gestion d'un hôtel attribué et de ses chambres.",
                  },
                  {
                    id: "ADMIN",
                    title: "Administrateur (ADMIN)",
                    desc: "Accès total : gestion de tous les hôtels, clients, chambres et KPI.",
                  },
                ].map((r) => (
                  <label
                    key={r.id}
                    className={`block p-3 rounded-2xl border cursor-pointer transition-colors ${
                      targetRole === r.id
                        ? "bg-amber-500/10 border-amber-500/50 text-white"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold text-xs">
                        <input
                          type="radio"
                          name="role"
                          value={r.id}
                          checked={targetRole === r.id}
                          onChange={(e) => setTargetRole(e.target.value)}
                          className="accent-amber-500"
                        />
                        <span>{r.title}</span>
                      </div>
                      {targetRole === r.id && <Check className="w-4 h-4 text-amber-400" />}
                    </div>
                    <p className="text-[11px] text-slate-400 ml-6 mt-1">{r.desc}</p>
                  </label>
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedUser(null)}
                >
                  Annuler
                </Button>
                <Button type="submit" variant="primary" size="sm" isLoading={isPending}>
                  Enregistrer les modifications
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Confirmation de Suppression */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-500/30 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/20 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Confirmer la suppression</h3>
                <p className="text-xs text-rose-400/80">Action irréversible</p>
              </div>
            </div>

            <p className="text-xs text-slate-300">
              Êtes-vous sûr de vouloir supprimer définitivement le compte de{" "}
              <strong className="text-white">{deletingUser.name}</strong> ({deletingUser.email}) ?
              Toutes ses réservations et avis associés seront supprimés de la base de données.
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setDeletingUser(null)}
              >
                Annuler
              </Button>
              <Button
                type="button"
                variant="danger"
                size="sm"
                isLoading={isPending}
                onClick={handleDeleteUser}
              >
                Supprimer le compte
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
