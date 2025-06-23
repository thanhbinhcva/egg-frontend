// src/pages/BuyerListPage.jsx
import React, { useState, useMemo } from "react";
import {
  Box, Button, Typography, TextField, MenuItem,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Pagination, Badge,
  IconButton
} from "@mui/material";
import { MoreVert } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import BuyerForm from "../components/BuyerForm";

/* ---------------- MOCK DATA ---------------- */
const initialBuyers = [
  { id: 1, code: "B01", name: "HP",  phone: "949132955",
    address: "SỐ NHÀ 33 B44 KHU B GELEXIMCO", quantity: "10 TRỨNG",
    price: "29K", lastDelivery: "2025-06-13", frequency: "Tuần", note: "" },
  { id: 2, code: "A01", name: "C DUNG", phone: "977217850",
    address: "SỐ NHÀ 10-A20 GELEXIMCO", quantity: "10 TRỨNG",
    price: "29K", lastDelivery: "2025-06-13", frequency: "", note: "" },
  { id: 3, code: "TM01", name: "C DUNG", phone: "973446066",
    address: "SỐ 11. ĐƯỜNG TỈNH 72 -QUYẾT TIẾN HÀ ĐÔNG", quantity: "10 TRỨNG",
    price: "29K", lastDelivery: "2025-06-14", frequency: "Tháng", note: "" },
  { id: 4, code: "B03", name: "NẤM", phone: "376251546",
    address: "", quantity: "10 TRỨNG",
    price: "29K", lastDelivery: "2025-06-13", frequency: "", note: "" },
];


/* --------------- PAGE COMPONENT ---------------- */
export default function BuyerListPage() {
  /* dữ liệu & phân trang */
  const [buyers, setBuyers] = useState(initialBuyers);
  const [page,  setPage]    = useState(1);
  const rowsPerPage         = 5;

  /* filter state */
  const [search,    setSearch]    = useState("");
  const [filterBy,  setFilterBy]  = useState("all");   // all | frequency | date
  const [fromDate,  setFromDate]  = useState("");
  const [toDate,    setToDate]    = useState("");

  /* form dialog */
  const [openForm, setOpenForm] = useState(false);
  const [editing,  setEditing]  = useState(null);

  /* ---------- thêm / sửa ---------- */
  const handleFormClose = (data) => {
    setOpenForm(false);
    if (data) {
      if (editing) {
        setBuyers(prev => prev.map(b => (b.id === editing.id ? { ...b, ...data } : b)));
      } else {
        const newBuyer = { id: Date.now(), ...data, price: "", frequency: "" };
        setBuyers(prev => [...prev, newBuyer]);
      }
    }
    setEditing(null);
  };

  /* Xoá */
  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xoá người mua này?")) {
      setBuyers(prev => prev.filter(b => b.id !== id));
    }
  };

  /* ---------- tính danh sách đã lọc ---------- */
  const filteredBuyers = useMemo(() => {
    let list = [...buyers];

    /* 1 ▶︎ search */
    if (search.trim()) {
      const kw = search.toLowerCase();
      list = list.filter(b =>
        [b.code, b.name, b.phone, b.address].some(x => x.toLowerCase().includes(kw))
      );
    }

    /* 2 ▶︎ filterBy */
    if (filterBy === "frequency") {
      list = list.filter(b => b.frequency);
    }
    if (filterBy === "date" && fromDate && toDate) {
      const f = new Date(fromDate);
      const t = new Date(toDate);
      list = list.filter(b => {
        const d = new Date(b.lastDelivery);
        return d >= f && d <= t;
      });
    }

    /* 3 ▶︎ range picker độc lập với filterBy */
    if (filterBy !== "date") {
      if (fromDate) list = list.filter(b => new Date(b.lastDelivery) >= new Date(fromDate));
      if (toDate)   list = list.filter(b => new Date(b.lastDelivery) <= new Date(toDate));
    }
    return list;
  }, [buyers, search, filterBy, fromDate, toDate]);

  /* ---------- phân trang ---------- */
  const pageCount      = Math.max(1, Math.ceil(filteredBuyers.length / rowsPerPage));
  const pagedBuyers    = filteredBuyers.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const handlePageChange = (_, value) => setPage(value);

  /* reset trang khi filter/search thay đổi */
  React.useEffect(() => { setPage(1); }, [search, filterBy, fromDate, toDate]);

  /* ---------- render ---------- */
  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Quản lý Người mua
      </Typography>

      {/* ====== THANH CÔNG CỤ ====== */}
      <Box display="flex" gap={2} flexWrap="wrap" mb={2}>
        <Button variant="contained" onClick={() => setOpenForm(true)}>
          + Thêm Người mua
        </Button>

        {/* Tìm kiếm */}
        <TextField
          placeholder="Tìm kiếm tên, SĐT, mã, địa chỉ..."
          size="small"
          value={search}
          onChange={e => setSearch(e.target.value)}
          sx={{ flex: 1, minWidth: 250 }}
        />

        {/* Lọc theo */}
        <TextField
          select
          label="Lọc theo"
          size="small"
          value={filterBy}
          onChange={e => setFilterBy(e.target.value)}
          sx={{ minWidth: 140 }}
        >
          <MenuItem value="all">Tất cả</MenuItem>
          <MenuItem value="frequency">Có tần suất mua</MenuItem>
          <MenuItem value="date">Ngày giao gần nhất</MenuItem>
        </TextField>

        {/* Date range */}
        <TextField
          type="date"
          label="Từ ngày"
          size="small"
          InputLabelProps={{ shrink: true }}
          value={fromDate}
          onChange={e => setFromDate(e.target.value)}
        />
        <TextField
          type="date"
          label="Đến ngày"
          size="small"
          InputLabelProps={{ shrink: true }}
          value={toDate}
          onChange={e => setToDate(e.target.value)}
        />
      </Box>

      {/* ====== BẢNG ====== */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Mã KH</TableCell>
              <TableCell>Tên KH</TableCell>
              <TableCell>Số điện thoại</TableCell>
              <TableCell>Địa chỉ giao</TableCell>
              <TableCell>Số lượng</TableCell>
              <TableCell>Giá</TableCell>
              <TableCell>Ngày giao gần nhất</TableCell>
              <TableCell>Tần suất mua</TableCell>
              <TableCell>Ghi chú</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {pagedBuyers.map((b, idx) => (
              <TableRow key={b.id}>
                <TableCell>{(page - 1) * rowsPerPage + idx + 1}</TableCell>
                <TableCell>{b.code}</TableCell>
                <TableCell>{b.name}</TableCell>
                <TableCell>{b.phone}</TableCell>
                <TableCell>{b.address}</TableCell>
                <TableCell>{b.quantity}</TableCell>
                <TableCell>{b.price}</TableCell>
                <TableCell>{b.lastDelivery}</TableCell>
                <TableCell>{b.frequency}</TableCell>
                <TableCell>{b.note}</TableCell>

                {/* --- cột action --- */}
                <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => { setEditing(b); setOpenForm(true); }}
                  >
                    <EditIcon fontSize="inherit" />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDelete(b.id)}
                  >
                    <DeleteIcon fontSize="inherit" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ====== PHÂN TRANG ====== */}
      <Box display="flex" justifyContent="flex-end" mt={2}>
        <Pagination
          count={pageCount}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>

      {/* ====== FORM THÊM/SỬA ====== */}
      {openForm && (
        <BuyerForm open={openForm} onClose={handleFormClose} initial={editing} />
      )}
    </Box>
  );
}
