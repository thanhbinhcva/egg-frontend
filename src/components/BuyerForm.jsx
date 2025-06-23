// src/components/BuyerForm.jsx
import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Box
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

/* ---------- validate ---------- */
const schema = yup.object({
  code:        yup.string().required('Bắt buộc'),
  name:        yup.string().required('Bắt buộc'),
  phone:       yup.string().required('Bắt buộc'),
  address:     yup.string().required('Bắt buộc'),
  quantity:    yup.string().required('Bắt buộc'),
  lastDelivery:yup.date().nullable(),
  note:        yup.string(),
});

/* ---------- component ---------- */
export default function BuyerForm({ open, onClose, initial }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver:     yupResolver(schema),
    defaultValues: initial ?? {
      code: '', name: '', phone: '',
      address: '', quantity: '', lastDelivery: '', note: '',
    },
  });

  const submit = (data) => { onClose(data); reset(); };

  return (
    <Dialog open={open} onClose={() => onClose(null)} fullWidth>
      <DialogTitle>{initial ? 'Cập nhật khách hàng' : 'Thêm khách hàng'}</DialogTitle>

      <form onSubmit={handleSubmit(submit)}>
        <DialogContent>
          {/* --- lưới 2 cột cho desktop, 1 cột cho mobile --- */}
          <Box
            sx={{
              display: 'grid',
              gap: 2,
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
            }}
          >
            <TextField label="Mã KH"       {...register('code')}     error={!!errors.code}     helperText={errors.code?.message} />
            <TextField label="Tên KH"      {...register('name')}     error={!!errors.name}     helperText={errors.name?.message} />
            <TextField label="SĐT"         {...register('phone')}    error={!!errors.phone}    helperText={errors.phone?.message} />
            <TextField label="Địa chỉ giao"{...register('address')}  error={!!errors.address}  helperText={errors.address?.message} />
            <TextField label="Số lượng"    {...register('quantity')} error={!!errors.quantity} helperText={errors.quantity?.message} />
            <TextField
              label="Ngày giao gần nhất"
              type="date"
              InputLabelProps={{ shrink: true }}
              {...register('lastDelivery')}
            />

            {/*  Ghi chú – chiếm nguyên hàng */}
            <Box sx={{ gridColumn: { xs: '1 / -1', sm: '1 / -1' } }}>
              <TextField
                label="Ghi chú"
                fullWidth
                multiline
                rows={4}
                {...register('note')}
              />
            </Box>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => onClose(null)}>Huỷ</Button>
          <Button type="submit" variant="contained">Lưu</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
