// src/pages/ProductsPage.jsx
import React, { useState, useMemo, useEffect } from "react";
import {
  Box, Typography, Button, TextField, MenuItem, Checkbox,
  FormControlLabel
} from "@mui/material";
import dayjs from "dayjs";
import ProductTable from "../components/ProductTable";
import ProductForm  from "../components/ProductForm";

const LOW_STOCK     = 10;
const EXPIRY_DAYS   = 7;

/* ---- dữ liệu mẫu (FAKE) ---- */
const initProducts = [
  {
    id: 1,
    code: "EGG-S",
    name: "Trứng gà ta size S",
    category: "S",
    unit: "Vỉ 10",
    price: 29000,
    stock: 8,
    productionDate: "2025-06-12",
    note: "Trang trại A",
  },
  {
    id: 2,
    code: "EGG-M",
    name: "Trứng gà ta size M",
    category: "M",
    unit: "Vỉ 10",
    price: 32000,
    stock: 35,
    productionDate: "2025-06-10",
    note: "",
  },
  {
    id: 3,
    code: "EGG-L",
    name: "Trứng gà ta size L",
    category: "L",
    unit: "Vỉ 10",
    price: 35000,
    stock: 4,
    productionDate: "2025-05-25",
    note: "Sắp hết hạn",
  },
  {
    id: 4,
    code: "DUCK-S",
    name: "Trứng vịt sạch",
    category: "Vịt",
    unit: "Vỉ 10",
    price: 30000,
    stock: 18,
    productionDate: "2025-06-05",
    note: "",
  },
  {
    id: 5,
    code: "QUAIL-30",
    name: "Trứng cút hộp 30",
    category: "Cút",
    unit: "Hộp 30",
    price: 22000,
    stock: 120,
    productionDate: "2025-06-15",
    note: "",
  },
  {
    id: 6,
    code: "OMEGA3",
    name: "Trứng Omega‑3",
    category: "Premium",
    unit: "Vỉ 10",
    price: 45000,
    stock: 6,
    productionDate: "2025-06-08",
    note: "Giàu dinh dưỡng",
  },
  {
    id: 7,
    code: "ORGANIC",
    name: "Trứng hữu cơ",
    category: "Organic",
    unit: "Vỉ 10",
    price: 50000,
    stock: 25,
    productionDate: "2025-06-17",
    note: "",
  },
  {
    id: 8,
    code: "BALUT",
    name: "Trứng lộn (Balut)",
    category: "Vịt",
    unit: "Vỉ 10",
    price: 40000,
    stock: 14,
    productionDate: "2025-06-14",
    note: "",
  },
  {
    id: 9,
    code: "SALTED-6",
    name: "Trứng muối vỉ 6",
    category: "Đặc biệt",
    unit: "Vỉ 6",
    price: 27000,
    stock: 9,
    productionDate: "2025-05-30",
    note: "Lô đặc biệt",
  },
  {
    id: 10,
    code: "TEA-MARBLE",
    name: "Trứng trà thảo mộc",
    category: "Đặc biệt",
    unit: "Hộp 4",
    price: 38000,
    stock: 40,
    productionDate: "2025-06-18",
    note: "",
  },
  {
    id: 11,
    code: "EGG-XL",
    name: "Trứng gà ta size XL",
    category: "XL",
    unit: "Vỉ 10",
    price: 38000,
    stock: 60,
    productionDate: "2025-06-16",
    note: "",
  },
  {
    id: 12,
    code: "DUCK-L",
    name: "Trứng vịt size L",
    category: "Vịt",
    unit: "Vỉ 6",
    price: 33000,
    stock: 7,
    productionDate: "2025-06-03",
    note: "",
  },
  {
    id: 13,
    code: "QUAIL-50",
    name: "Trứng cút hộp 50",
    category: "Cút",
    unit: "Hộp 50",
    price: 32000,
    stock: 200,
    productionDate: "2025-06-11",
    note: "",
  },
  {
    id: 14,
    code: "GEESE",
    name: "Trứng ngỗng",
    category: "Premium",
    unit: "Cái",
    price: 60000,
    stock: 3,
    productionDate: "2025-06-07",
    note: "Hiếm",
  },
  {
    id: 15,
    code: "EMU",
    name: "Trứng đà điểu Emu",
    category: "Đặc biệt",
    unit: "Cái",
    price: 180000,
    stock: 2,
    productionDate: "2025-05-20",
    note: "Kích cỡ lớn",
  },
];

export default function ProductsPage() {
  /* dữ liệu */
  const [products, setProducts] = useState(initProducts);

  /* form dialog */
  const [openForm, setOpenForm] = useState(false);
  const [editing,  setEditing]  = useState(null);

  /* --- state tìm kiếm & lọc --- */
  const [search,  setSearch]  = useState("");
  const [filterBy, setFilterBy] = useState("all");  // all | category | lowstock | expiry
  const [category, setCategory] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate,   setToDate]   = useState("");

  /* ---------------- CRUD ---------------- */
  const handleSave = (data) => {
    setOpenForm(false);
    if (!data) return setEditing(null);

    setProducts(prev =>
      editing
        ? prev.map(p => (p.id === editing.id ? { ...p, ...data } : p))
        : [...prev, { id: Date.now(), ...data }]
    );
    setEditing(null);
  };
  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xoá sản phẩm này?"))
      setProducts(prev => prev.filter(p => p.id !== id));
  };

  /* ---------------- LỌC ---------------- */
  const filteredProducts = useMemo(() => {
    let list = [...products];

    /* tìm kiếm */
    if (search.trim()) {
      const kw = search.toLowerCase();
      list = list.filter(p =>
        [p.code, p.name, p.note].some(x => x.toLowerCase().includes(kw))
      );
    }

    /* bộ lọc theo loại / tồn kho / HSD */
    if (filterBy === "category" && category) {
      list = list.filter(p => p.category === category);
    }
    if (filterBy === "lowstock") {
      list = list.filter(p => p.stock < LOW_STOCK);
    }
    if (filterBy === "expiry") {
      list = list.filter(p =>
        dayjs(p.productionDate).add(30, "day").diff(dayjs(), "day") <= EXPIRY_DAYS
      );
    }

    /* Khoảng ngày SX */
    if (fromDate) list = list.filter(p => dayjs(p.productionDate).isAfter(dayjs(fromDate).subtract(1, "day")));
    if (toDate)   list = list.filter(p => dayjs(p.productionDate).isBefore(dayjs(toDate).add(1, "day")));

    return list;
  }, [products, search, filterBy, category, fromDate, toDate]);

  /* ---------------- giao diện ---------------- */
  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Quản lý Sản phẩm (Trứng)
      </Typography>

      {/* Thanh công cụ */}
      <Box display="flex" flexWrap="wrap" gap={2} mb={2}>
        <Button variant="contained" onClick={() => { setEditing(null); setOpenForm(true); }}>
          + Thêm sản phẩm
        </Button>

        <TextField
          placeholder="Tìm kiếm mã, tên, ghi chú..."
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ flex: 1, minWidth: 220 }}
        />

        <TextField
          select
          label="Lọc theo"
          size="small"
          value={filterBy}
          onChange={(e) => setFilterBy(e.target.value)}
          sx={{ minWidth: 140 }}
        >
          <MenuItem value="all">Tất cả</MenuItem>
          <MenuItem value="category">Loại</MenuItem>
          <MenuItem value="lowstock">Tồn kho &lt; {LOW_STOCK}</MenuItem>
          <MenuItem value="expiry">HSD ≤ {EXPIRY_DAYS} ngày</MenuItem>
        </TextField>

        {/* khi chọn lọc theo category hiển thị combobox loại */}
        {filterBy === "category" && (
          <TextField
            select
            label="Loại trứng"
            size="small"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            sx={{ minWidth: 110 }}
          >
            {/* lấy dynamic unique category */}
            {[...new Set(products.map(p => p.category))].map(cat => (
              <MenuItem key={cat} value={cat}>{cat}</MenuItem>
            ))}
          </TextField>
        )}

        {/* Khoảng ngày sản xuất */}
        <TextField
          type="date"
          label="Từ ngày SX"
          size="small"
          InputLabelProps={{ shrink: true }}
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />
        <TextField
          type="date"
          label="Đến ngày SX"
          size="small"
          InputLabelProps={{ shrink: true }}
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />
      </Box>

      {/* Bảng */}
      <ProductTable
        rows={filteredProducts}
        onEdit={(row) => { setEditing(row); setOpenForm(true); }}
        onDelete={handleDelete}
      />

      {openForm && (
        <ProductForm open={openForm} onClose={handleSave} initial={editing} />
      )}
    </Box>
  );
}
