// src/components/ProductTable.jsx
import React, { useMemo } from "react";
import {
  DataGrid, gridClasses
} from "@mui/x-data-grid";
import {
  Box, Paper, Typography, IconButton, Badge
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import dayjs from "dayjs";

/* ------ hằng số cảnh báo ------ */
const EXPIRY_DAYS = 30;
const LOW_STOCK   = 10;
const TODAY       = dayjs();     // 2025‑06‑19

/* ====== COMPONENT ====== */
export default function ProductTable({ rows, onEdit, onDelete }) {
  /* 👉 Tính thêm expiryDate */
  const processedRows = useMemo(
    () =>
      rows.map((p) => ({
        ...p,
        expiryDate: dayjs(p.productionDate)
          .add(EXPIRY_DAYS, "day")
          .format("YYYY-MM-DD"),
      })),
    [rows]
  );

  /* ---------- cột ---------- */
  const columns = [
    { field: "code", headerName: "Mã SP", flex: 0.6 },
    { field: "name", headerName: "Tên sản phẩm", flex: 1 },
    { field: "category", headerName: "Loại", flex: 0.6 },
    { field: "unit", headerName: "Đơn vị", flex: 0.6 },
    {
      field: "price",
      headerName: "Giá (đ)",
      flex: 0.6,
      headerAlign: "right",
      align: "right",
      valueFormatter: ({ value }) =>
        typeof value === "number" ? value.toLocaleString("vi-VN") + "₫" : "",
    },
    {
      field: "stock",
      headerName: "Tồn kho",
      flex: 0.5,
      headerAlign: "center",
      align: "center",
      renderCell: ({ value }) =>
        value < LOW_STOCK ? (
          <Badge badgeContent={value} color="error" />
        ) : (
          value
        ),
    },
    {
      field: "productionDate",
      headerName: "Ngày SX",
      flex: 0.75,
      valueFormatter: ({ value }) => dayjs(value).format("DD/MM/YYYY"),
    },
    {
      field: "expiryDate",
      headerName: "HSD",
      flex: 0.7,
      valueFormatter: ({ value }) => dayjs(value).format("DD/MM/YYYY"),
      cellClassName: ({ value }) => {
        const diff = dayjs(value).diff(TODAY, "day");
        if (diff <= 0) return "expired";
        if (diff <= 7) return "near-expired";
        return "";
      },
    },
    { field: "note", headerName: "Ghi chú", flex: 1 },
    {
      field: "actions",
      headerName: "Thao tác",
      width: 120,
      sortable: false,
      filterable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <>
          <IconButton
            size="small"
            onClick={() => onEdit && onEdit(params.row)}
          >
            <EditIcon fontSize="inherit" color="primary" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => onDelete && onDelete(params.row.id)}
            color="error"
          >
            <DeleteIcon fontSize="inherit" />
          </IconButton>
        </>
      ),
    },
  ];

  /* ---------- render ---------- */
  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        borderRadius: 2,
        border: "1px solid #e0e0e0",
        bgcolor: "#fff",
      }}
    >
      <Typography variant="h6" fontWeight="bold" mb={2}>
        Danh sách sản phẩm trứng
      </Typography>

      <Box sx={{ height: 540 }}>
        <DataGrid
          rows={processedRows}
          columns={columns}
          pageSize={8}
          rowsPerPageOptions={[8]}
          disableSelectionOnClick
          autoHeight
          getRowId={(row) => row.id}
          sx={{
            border: "none",
            [`& .${gridClasses.columnHeaders}`]: {
              bgcolor: "#f5f5f5",
              fontWeight: "bold",
            },
            [`& .${gridClasses.row}:hover`]: {
              bgcolor: "#fafafa",
            },
            [`& .expired`]: {
              bgcolor: "#ffebee",
              color: "#c62828",
              fontWeight: 600,
            },
            [`& .near-expired`]: {
              bgcolor: "#fff8e1",
              color: "#ef6c00",
              fontWeight: 600,
            },
            "& .MuiDataGrid-cell": {
              fontSize: 14,
            },
          }}
        />
      </Box>
    </Paper>
  );
}


// const INIT_PRODUCTS = [
//   {
//     id: 1,
//     code: "EGG-S",
//     name: "Trứng gà ta size S",
//     category: "S",
//     unit: "Vỉ 10",
//     price: 29000,
//     stock: 8,
//     productionDate: "2025-06-12",
//     note: "Trang trại A"
//   },
//   {
//     id: 2,
//     code: "EGG-M",
//     name: "Trứng gà ta size M",
//     category: "M",
//     unit: "Vỉ 10",
//     price: 32000,
//     stock: 35,
//     productionDate: "2025-06-10",
//     note: ""
//   },
//   {
//     id: 3,
//     code: "EGG-L",
//     name: "Trứng gà ta size L",
//     category: "L",
//     unit: "Vỉ 10",
//     price: 35000,
//     stock: 4,
//     productionDate: "2025-05-25",
//     note: "Sắp hết hạn"
//   },
//   {
//     id: 4,
//     code: "DUCK-S",
//     name: "Trứng vịt sạch",
//     category: "S",
//     unit: "Vỉ 10",
//     price: 30000,
//     stock: 18,
//     productionDate: "2025-06-05",
//     note: ""
//   },
//   {
//     id: 5,
//     code: "QUAIL",
//     name: "Trứng cút",
//     category: "XS",
//     unit: "Hộp 30",
//     price: 22000,
//     stock: 120,
//     productionDate: "2025-06-15",
//     note: ""
//   }
// ];