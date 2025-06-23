// src/components/ProductForm.jsx
import React, { useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Box
} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

/* ---------- validate schema ---------- */
const schema = yup.object({
  code:           yup.string().required("Bắt buộc"),
  name:           yup.string().required("Bắt buộc"),
  category:       yup.string().required("Bắt buộc"),
  unit:           yup.string().required("Bắt buộc"),
  price:          yup.number().typeError("Phải là số").positive().required(),
  stock:          yup.number().typeError("Phải là số").min(0).required(),
  productionDate: yup.date().required(),
  note:           yup.string(),
});

/* ---------- component ---------- */
export default function ProductForm({ open, onClose, initial }) {
  const defaultValues = {
    code: "",
    name: "",
    category: "",
    unit: "",
    price: "",
    stock: "",
    productionDate: "",
    note: "",
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  /* ✅ khi prop `initial` thay đổi, reset form */
  useEffect(() => {
    if (initial) {
      // Chỉnh sửa – nạp dữ liệu cũ
      reset({
        ...initial,
        price: Number(initial.price || 0),
        stock: Number(initial.stock || 0),
      });
    } else {
      reset(defaultValues); // Thêm mới – xoá sạch
    }
  }, [initial, reset]);

  /* submit */
  const onSubmit = (data) => {
    onClose(data);          // gửi dữ liệu về trang cha
    reset(defaultValues);   // dọn form
  };

  return (
    <Dialog open={open} onClose={() => onClose(null)} fullWidth maxWidth="sm">
      <DialogTitle>{initial ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}</DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Box
            sx={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
            }}
          >
            <TextField label="Mã SP" {...register("code")} error={!!errors.code} helperText={errors.code?.message} />
            <TextField label="Tên sản phẩm" {...register("name")} error={!!errors.name} helperText={errors.name?.message} />

            <TextField label="Loại" {...register("category")} error={!!errors.category} helperText={errors.category?.message} />
            <TextField label="Đơn vị" {...register("unit")} error={!!errors.unit} helperText={errors.unit?.message} />

            <TextField
              label="Giá (VND)"
              type="number"
              {...register("price")}
              error={!!errors.price}
              helperText={errors.price?.message}
            />
            <TextField
              label="Tồn kho"
              type="number"
              {...register("stock")}
              error={!!errors.stock}
              helperText={errors.stock?.message}
            />

            <TextField
              label="Ngày sản xuất"
              type="date"
              InputLabelProps={{ shrink: true }}
              {...register("productionDate")}
              error={!!errors.productionDate}
              helperText={errors.productionDate?.message}
            />

            {/* Ghi chú – chiếm cả hàng */}
            <Box sx={{ gridColumn: "1 / -1" }}>
              <TextField
                label="Ghi chú"
                fullWidth
                multiline
                rows={4}
                {...register("note")}
              />
            </Box>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => onClose(null)}>Huỷ</Button>
          <Button type="submit" variant="contained">
            Lưu
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
