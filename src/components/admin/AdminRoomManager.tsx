"use client";

import React, { useState, useTransition } from "react";
import Image from "next/image";
import {
  createRoomAction,
  updateRoomAction,
  deleteRoomAction,
  toggleRoomStatusAction,
  uploadRoomImageAction,
} from "@/actions/admin";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";
import { RoomStatus, RoomType } from "@/types/enums";
import {
  Plus,
  Edit3,
  Trash2,
  UploadCloud,
  Image as ImageIcon,
  X,
  CheckCircle2,
  AlertTriangle,
  Bed,
  Maximize,
  Users,
} from "lucide-react";

interface HotelItem {
  id: string;
  name: string;
}

interface AdminRoomItem {
  id: string;
  hotelId: string;
  hotelName: string;
  name: string;
  roomNumber: string | null;
  description: string;
  type: RoomType;
  capacity: number;
  size: number;
  pricePerNight: number;
  quantity: number;
  status: RoomStatus;
  images: string[];
}

export function AdminRoomManager({
  hotels,
  rooms,
}: {
  hotels: HotelItem[];
  rooms: AdminRoomItem[];
}) {
  const [isPending, startTransition] = useTransition();

  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // States pour la Création et Modification
  const [isCreating, setIsCreating] = useState(false);
  const [editingRoom, setEditingRoom] = useState<AdminRoomItem | null>(null);
  const [deletingRoom, setDeletingRoom] = useState<AdminRoomItem | null>(null);

  // Champs de formulaire
  const [selectedHotelId, setSelectedHotelId] = useState(hotels[0]?.id || "");
  const [name, setName] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [pricePerNight, setPricePerNight] = useState(150);
  const [quantity, setQuantity] = useState(1);
  const [capacity, setCapacity] = useState(2);
  const [size, setSize] = useState(28);
  const [description, setDescription] = useState("");
  const [type, setType] = useState<RoomType>("DOUBLE");
  const [status, setStatus] = useState<RoomStatus>("AVAILABLE");

  // Liste d'URLs d'images pour la chambre en cours d'édition/création
  const [roomImages, setRoomImages] = useState<string[]>([]);
  const [customImageUrl, setCustomImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Réinitialiser le formulaire
  const resetForm = () => {
    setSelectedHotelId(hotels[0]?.id || "");
    setName("");
    setRoomNumber("");
    setPricePerNight(150);
    setQuantity(1);
    setCapacity(2);
    setSize(28);
    setDescription("");
    setType("DOUBLE");
    setStatus("AVAILABLE");
    setRoomImages([]);
    setCustomImageUrl("");
  };

  // Ouvrir modal de création
  const openCreateModal = () => {
    resetForm();
    setIsCreating(true);
  };

  // Ouvrir modal d'édition
  const openEditModal = (room: AdminRoomItem) => {
    setEditingRoom(room);
    setSelectedHotelId(room.hotelId);
    setName(room.name);
    setRoomNumber(room.roomNumber || "");
    setPricePerNight(room.pricePerNight);
    setQuantity(room.quantity);
    setCapacity(room.capacity);
    setSize(room.size);
    setDescription(room.description);
    setType(room.type);
    setStatus(room.status);
    setRoomImages(room.images || []);
    setCustomImageUrl("");
  };

  // Upload d'image fichier
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setMessage(null);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append("file", file);

      const res = await uploadRoomImageAction(formData);
      if (res.success && res.url) {
        setRoomImages((prev) => [...prev, res.url!]);
      } else {
        setMessage({ type: "error", text: res.message || "Erreur d'upload." });
      }
    }
    setIsUploading(false);
    e.target.value = "";
  };

  // Ajouter image via URL
  const handleAddImageUrl = () => {
    if (!customImageUrl.trim()) return;
    setRoomImages((prev) => [...prev, customImageUrl.trim()]);
    setCustomImageUrl("");
  };

  // Supprimer une image de la liste
  const handleRemoveImage = (index: number) => {
    setRoomImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Soumission Création
  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    startTransition(async () => {
      const res = await createRoomAction(
        {
          hotelId: selectedHotelId,
          name,
          roomNumber,
          pricePerNight,
          quantity,
          capacity,
          size,
          description,
          type,
          status,
          amenityIds: [],
        },
        roomImages
      );

      if (res.success) {
        setMessage({ type: "success", text: res.message });
        setIsCreating(false);
        resetForm();
      } else {
        setMessage({ type: "error", text: res.message });
      }
    });
  };

  // Soumission Modification
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRoom) return;
    setMessage(null);

    startTransition(async () => {
      const res = await updateRoomAction(
        editingRoom.id,
        {
          hotelId: selectedHotelId,
          name,
          roomNumber,
          pricePerNight,
          quantity,
          capacity,
          size,
          description,
          type,
          status,
          amenityIds: [],
        },
        roomImages
      );

      if (res.success) {
        setMessage({ type: "success", text: res.message });
        setEditingRoom(null);
        resetForm();
      } else {
        setMessage({ type: "error", text: res.message });
      }
    });
  };

  // Soumission Suppression
  const handleDeleteRoom = async () => {
    if (!deletingRoom) return;
    setMessage(null);

    startTransition(async () => {
      const res = await deleteRoomAction(deletingRoom.id);
      if (res.success) {
        setMessage({ type: "success", text: res.message });
        setDeletingRoom(null);
      } else {
        setMessage({ type: "error", text: res.message });
      }
    });
  };

  // Toggle Maintenance / Activation
  const handleToggleStatus = (id: string, currentStatus: RoomStatus) => {
    setMessage(null);
    startTransition(async () => {
      const res = await toggleRoomStatusAction(id, currentStatus);
      if (res.success) {
        setMessage({ type: "success", text: res.message });
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

      {/* Action Header Bar */}
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl">
        <div className="flex items-center gap-2">
          <Bed className="w-5 h-5 text-amber-400" />
          <h2 className="text-sm font-bold text-white">
            Catalogue des Chambres ({rooms.length})
          </h2>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={openCreateModal}
          className="flex items-center gap-1.5 text-xs"
        >
          <Plus className="w-4 h-4" /> Ajouter une nouvelle chambre
        </Button>
      </div>

      {/* Grid of Room Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rooms.map((room) => (
          <div
            key={room.id}
            className={`bg-slate-900 border rounded-3xl p-6 space-y-4 shadow-xl flex flex-col justify-between ${
              room.status === "AVAILABLE"
                ? "border-slate-800"
                : "border-amber-500/40 bg-amber-950/10"
            }`}
          >
            <div className="space-y-3">
              {/* Header Info */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    {room.hotelName} &bull; N° {room.roomNumber || "N/A"}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-0.5">{room.name}</h3>
                </div>

                <Badge
                  variant={
                    room.status === "AVAILABLE"
                      ? "success"
                      : room.status === "MAINTENANCE"
                      ? "warning"
                      : "danger"
                  }
                >
                  {room.status === "AVAILABLE" ? "Disponible" : "Maintenance"}
                </Badge>
              </div>

              {/* Gallery Thumbnails */}
              {room.images && room.images.length > 0 ? (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {room.images.map((imgUrl, i) => (
                    <div
                      key={i}
                      className="relative w-16 h-12 rounded-xl overflow-hidden shrink-0 border border-slate-800"
                    >
                      <Image
                        src={imgUrl}
                        alt={`${room.name} ${i + 1}`}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-center justify-center gap-2 text-slate-500 text-xs">
                  <ImageIcon className="w-4 h-4" /> Aucune photo rattachée
                </div>
              )}

              <p className="text-xs text-slate-400 line-clamp-2">{room.description}</p>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-2 pt-2 text-xs text-slate-300">
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Capacité</span>
                  <span className="font-bold text-white">{room.capacity} pers.</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Surface</span>
                  <span className="font-bold text-white">{room.size} m²</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Inventaire</span>
                  <span className="font-bold text-white">{room.quantity} unités</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
              <div>
                <span className="text-[10px] text-slate-400 block">Tarif / Nuit</span>
                <p className="text-lg font-black text-amber-400">
                  {formatPrice(room.pricePerNight, "USD")}
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditModal(room)}
                  className="flex items-center gap-1 text-xs"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Modifier
                </Button>

                <Button
                  variant={room.status === "AVAILABLE" ? "outline" : "primary"}
                  size="sm"
                  disabled={isPending}
                  onClick={() => handleToggleStatus(room.id, room.status)}
                  className="text-xs"
                >
                  {room.status === "AVAILABLE" ? "Maintenance" : "Activer"}
                </Button>

                <Button
                  variant="danger"
                  size="sm"
                  disabled={isPending}
                  onClick={() => setDeletingRoom(room)}
                  className="p-2 text-xs"
                  title="Supprimer la chambre"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {rooms.length === 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400 text-xs">
          Aucune chambre n&apos;a été créée pour le moment. Cliquer sur &quot;Ajouter une nouvelle chambre&quot; ci-dessus pour commencer.
        </div>
      )}

      {/* Modal Création / Modification de Chambre */}
      {(isCreating || editingRoom) && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">
                {isCreating ? "Créer une nouvelle catégorie de chambre" : `Modifier : ${editingRoom?.name}`}
              </h3>
              <button
                onClick={() => {
                  setIsCreating(false);
                  setEditingRoom(null);
                }}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={isCreating ? handleCreateRoom : handleSaveEdit}
              className="space-y-4 text-xs"
            >
              {/* Choix de l'Hôtel */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Établissement</label>
                <select
                  value={selectedHotelId}
                  onChange={(e) => setSelectedHotelId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                >
                  {hotels.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Nom & Numéro */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Nom de la catégorie</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: Suite Exécutive Vue Piscine"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Numéro(s) de chambre</label>
                  <input
                    type="text"
                    placeholder="ex: 101-110 ou 501"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Type & Statut */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Type de lit / Format</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as RoomType)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="SINGLE">SINGLE (Simple)</option>
                    <option value="DOUBLE">DOUBLE (Lit King)</option>
                    <option value="TWIN">TWIN (2 Lits simples)</option>
                    <option value="DELUXE">DELUXE (Grand confort)</option>
                    <option value="SUITE">SUITE (Salon &amp; Vue)</option>
                    <option value="FAMILY">FAMILY (Familiale)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Statut initial</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as RoomStatus)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="AVAILABLE">AVAILABLE (Disponible)</option>
                    <option value="MAINTENANCE">MAINTENANCE (En maintenance)</option>
                    <option value="INACTIVE">INACTIVE (Masquée)</option>
                  </select>
                </div>
              </div>

              {/* Prix, Quantité, Capacité, Surface */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Prix/nuit ($)</label>
                  <input
                    type="number"
                    required
                    min={10}
                    value={pricePerNight}
                    onChange={(e) => setPricePerNight(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Quantité (Unités)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Capacité max</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={capacity}
                    onChange={(e) => setCapacity(parseInt(e.target.value) || 1)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Surface (m²)</label>
                  <input
                    type="number"
                    required
                    min={5}
                    value={size}
                    onChange={(e) => setSize(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Description détaillée</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Équipements, vue, disposition..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              {/* Importation d'Images (Fichiers & URLs) */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <label className="block font-semibold text-slate-300">
                  Galerie Photo &amp; Importation d&apos;Images
                </label>

                {/* Upload Fichier */}
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors">
                    <UploadCloud className="w-4 h-4" />
                    <span>{isUploading ? "Téléchargement..." : "Importer des photos (Fichier)"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      disabled={isUploading}
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Ajout par URL directe */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Ou collez une URL d'image (/images/... ou https://...)"
                    value={customImageUrl}
                    onChange={(e) => setCustomImageUrl(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddImageUrl}
                    className="text-xs shrink-0"
                  >
                    Ajouter URL
                  </Button>
                </div>

                {/* Aperçu des images attachées */}
                {roomImages.length > 0 ? (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 pt-2">
                    {roomImages.map((url, idx) => (
                      <div
                        key={idx}
                        className="relative group rounded-xl overflow-hidden border border-slate-800 h-16 bg-slate-950"
                      >
                        <Image
                          src={url}
                          alt={`Aperçu ${idx + 1}`}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-1 right-1 bg-rose-600/90 text-white p-0.5 rounded-md opacity-90 hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-500 italic">
                    Aucune photo rattachée pour le moment.
                  </p>
                )}
              </div>

              {/* Form Footer */}
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingRoom(null);
                  }}
                >
                  Annuler
                </Button>
                <Button type="submit" variant="primary" size="sm" isLoading={isPending}>
                  {isCreating ? "Créer la chambre" : "Enregistrer la chambre"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Confirmation de Suppression */}
      {deletingRoom && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-500/30 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/20 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Supprimer la chambre ?</h3>
                <p className="text-xs text-rose-400/80">Action irréversible</p>
              </div>
            </div>

            <p className="text-xs text-slate-300">
              Êtes-vous sûr de vouloir supprimer définitivement la chambre{" "}
              <strong className="text-white">{deletingRoom.name}</strong> ({deletingRoom.hotelName}) ?
              Les images associées seront également effacées.
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setDeletingRoom(null)}
              >
                Annuler
              </Button>
              <Button
                type="button"
                variant="danger"
                size="sm"
                isLoading={isPending}
                onClick={handleDeleteRoom}
              >
                Supprimer la chambre
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
