"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { jwtDecode } from "jwt-decode";
import { NotificationPopup, useNotification } from "@/components/notification-popup";

type JWTPayload = {
  id: string;
};

export default function PeminjamanForm() {
  const { notification, showNotification, closeNotification } = useNotification();
  const [nama, setNama] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [kelas, setKelas] = useState("");
  const [keperluan, setKeperluan] = useState("");
  const [jumlah, setJumlah] = useState<number | "">(0);
  const [tglPinjam, setTglPinjam] = useState<Date | undefined>(undefined);
  const [tglKembali, setTglKembali] = useState<Date | undefined>(undefined);

  const [listBarang, setListBarang] = useState<{ id: number; nama: string; stok: number; jenis: string }[]>([]);
  const [selectedBarangId, setSelectedBarangId] = useState<number | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchBarang() {
      try {
        const res = await fetch("/api/barang");
        const data = await res.json();

        const filtered = data.filter((barang: any) => barang.jenis?.toLowerCase() === "peminjaman");

        setListBarang(filtered);
        if (filtered.length > 0) setSelectedBarangId(filtered[0].id);
      } catch (error) {
        console.error("Gagal load barang:", error);
      }
    }

    function getUserFromCookie() {
      const cookieStr = document.cookie;
      const token = cookieStr
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      if (!token) {
        showNotification('error', 'Login Diperlukan', 'Token tidak ditemukan, silakan login ulang.');
        return;
      }

      try {
        const decoded = jwtDecode<JWTPayload>(decodeURIComponent(token));
        setUserId(parseInt(decoded.id));
      } catch (err) {
        console.error("Gagal decode token:", err);
        showNotification('error', 'Token Tidak Valid', 'Silakan login ulang untuk melanjutkan.');
      }
    }

    fetchBarang();
    getUserFromCookie();
  }, [showNotification]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      showNotification('error', 'Login Diperlukan', 'User tidak ditemukan. Silakan login ulang.');
      return;
    }
    if (!nama.trim()) {
      showNotification('warning', 'Data Tidak Lengkap', 'Nama wajib diisi');
      return;
    }
    if (!jabatan) {
      showNotification('warning', 'Data Tidak Lengkap', 'Jabatan wajib dipilih');
      return;
    }
    if (!keperluan.trim()) {
      showNotification('warning', 'Data Tidak Lengkap', 'Keperluan wajib diisi');
      return;
    }
    if (!selectedBarangId) {
      showNotification('warning', 'Data Tidak Lengkap', 'Pilih barang terlebih dahulu');
      return;
    }
    if (jumlah === "" || jumlah <= 0) {
      showNotification('warning', 'Data Tidak Valid', 'Jumlah harus lebih dari 0');
      return;
    }
    if (!tglPinjam) {
      showNotification('warning', 'Data Tidak Lengkap', 'Tanggal peminjaman wajib dipilih');
      return;
    }
    if (!tglKembali) {
      showNotification('warning', 'Data Tidak Lengkap', 'Tanggal pengembalian wajib dipilih');
      return;
    }
    if (tglKembali < tglPinjam) {
      showNotification('error', 'Tanggal Tidak Valid', 'Tanggal pengembalian tidak boleh sebelum tanggal peminjaman');
      return;
    }

    const data = {
      nama: nama.trim(),
      jabatan,
      kelas: kelas.trim(),
      keperluan: keperluan.trim(),
      barangId: selectedBarangId,
      jumlahBarang: Number(jumlah),
      tanggalPengajuan: format(tglPinjam, "yyyy-MM-dd"),
      tanggalPengembalian: format(tglKembali, "yyyy-MM-dd"),
      userId,
    };

    try {
      const res = await fetch("/api/peminjaman", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        showNotification('success', 'Berhasil! 🎉', 'Peminjaman berhasil diajukan dan menunggu persetujuan admin');
        setNama("");
        setJabatan("");
        setKelas("");
        setKeperluan("");
        setJumlah(0);
        setTglPinjam(undefined);
        setTglKembali(undefined);

        const resBarang = await fetch("/api/barang");
        const updatedBarang = await resBarang.json();

        const filtered = updatedBarang.filter((barang: any) => barang.jenis?.toLowerCase() === "peminjaman");
        setListBarang(filtered);
        if (filtered.length > 0) setSelectedBarangId(filtered[0].id);
      } else {
        const errorData = await res.json();
        showNotification('error', 'Gagal Menyimpan', errorData.message || 'Terjadi kesalahan saat menyimpan data');
      }
    } catch (error) {
      console.error("Error saat submit:", error);
      showNotification('error', 'Kesalahan Server', 'Terjadi kesalahan saat menghubungi server. Coba lagi nanti.');
    }
  };

  return (
    <>
      <NotificationPopup
        isOpen={notification.isOpen}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        onClose={closeNotification}
      />
      <form className="space-y-6 max-w-md mx-auto" onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="nama">Nama</Label>
          <Input
            id="nama"
            type="text"
            placeholder="Masukkan nama"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="jabatan">Jabatan</Label>
          <select
            id="jabatan"
            value={jabatan}
            onChange={(e) => setJabatan(e.target.value)}
            required
            className="w-full border border-input rounded-md px-3 py-2"
          >
            <option value="">Pilih jabatan</option>
            <option value="Guru">Guru</option>
            <option value="Staf">Staf</option>
            <option value="Siswa">Siswa</option>
          </select>
        </div>

        <div>
          <Label htmlFor="kelas">Kelas</Label>
          <Input
            id="kelas"
            type="text"
            placeholder="Masukkan kelas"
            value={kelas}
            onChange={(e) => setKelas(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="namaBarang">Nama Barang</Label>
          <select
            id="namaBarang"
            value={selectedBarangId ?? ""}
            onChange={(e) => setSelectedBarangId(Number(e.target.value))}
            required
            className="w-full border border-input rounded-md px-3 py-2"
          >
            <option value="" disabled>
              Pilih barang
            </option>
            {listBarang.map((barang) => (
              <option key={barang.id} value={barang.id}>
                {barang.nama} (Stok: {barang.stok})
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="keperluan">Keperluan</Label>
          <Textarea
            id="keperluan"
            placeholder="Tuliskan keperluan"
            value={keperluan}
            onChange={(e) => setKeperluan(e.target.value)}
            required
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="jumlah">Jumlah</Label>
          <Input
            id="jumlah"
            type="number"
            placeholder="Masukkan jumlah"
            value={jumlah}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "") setJumlah("");
              else setJumlah(Number(val));
            }}
            min={1}
            required
          />
        </div>

        <div>
          <Label htmlFor="tglPinjam">Tanggal Peminjaman</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="tglPinjam"
                variant="outline"
                className="w-full justify-start text-left"
              >
                {tglPinjam ? format(tglPinjam, "dd MMM yyyy") : "Pilih tanggal"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={tglPinjam}
                onSelect={setTglPinjam}
                disabled={(date) => date > new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label htmlFor="tglKembali">Tanggal Pengembalian</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="tglKembali"
                variant="outline"
                className="w-full justify-start text-left"
              >
                {tglKembali ? format(tglKembali, "dd MMM yyyy") : "Pilih tanggal"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={tglKembali}
                onSelect={setTglKembali}
                disabled={(date) => (tglPinjam ? date < tglPinjam : false)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <Button type="submit" className="w-full">
          Submit
        </Button>
      </form>
    </>
  );
}
