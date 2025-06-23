// src/components/BuyerTable.jsx
import { DataGrid } from '@mui/x-data-grid';
import { IconButton } from '@mui/material';
import Edit from '@mui/icons-material/Edit';
import Delete from '@mui/icons-material/Delete';
import dayjs from 'dayjs';

export default function BuyerTable({ rows, onEdit, onDelete }) {
  const columns = [
    { field: 'code', headerName: 'Mã KH', flex: 0.6 },
    { field: 'name', headerName: 'Tên KH', flex: 1 },
    { field: 'phone', headerName: 'SĐT', flex: 0.8 },
    { field: 'address', headerName: 'Địa chỉ giao', flex: 1.6 },
    {
      field: 'lastDelivery',
      headerName: 'Ngày giao gần nhất',
      flex: 0.9,
      valueFormatter: ({ value }) => (value ? dayjs(value).format('DD/MM/YYYY') : ''),
    },
    {
      field: 'actions',
      headerName: '',
      width: 110,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => onEdit(params.row)}><Edit fontSize="small" /></IconButton>
          <IconButton color="error" onClick={() => onDelete(params.row.id)}><Delete fontSize="small" /></IconButton>
        </>
      ),
    },
  ];
  return <DataGrid rows={rows} columns={columns} autoHeight pageSize={8} />;
}
