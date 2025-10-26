import {useState, useEffect} from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '../components/animate-ui/radix/dialog';
import {useSelector, useDispatch} from 'react-redux';
import type {RootState} from '../store/store';
import {setEditTitle, setEditSection} from '../store/slice/profHomeSlice';
import supabase from '../config/config';
import Swal from 'sweetalert2';

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function EditClassModal({ open, onOpenChange }: ModalProps) {
  const dispatch = useDispatch();

  const editID = useSelector((state: RootState) => state.profHome.editID);
  const editCode = useSelector((state: RootState) => state.profHome.editCode);
  const editTitle = useSelector((state: RootState) => state.profHome.editTitle);
  const editSection = useSelector((state: RootState) => state.profHome.editSection);

  const submit = async () => {
    const {error} = await supabase.from('class_classprof').update({class_classprof_title: editTitle, class_classprof_section: editSection}).eq('class_classprof_id', editID);

    if (error) {
      Swal.fire({
        title:'Error Updating Class',
        text:'There has been error in updating class',
        icon:'error',
        timer:1500,
        showConfirmButton:false,
        willClose: () => {
          window.location.reload();
        }
      })
    }

    else {
      const {error: error2} = await supabase.from('class_classstud').update({class_classstud_title: editTitle, class_classstud_section: editSection}).eq('class_classstud_code',editCode);

      if (error2) {
        Swal.fire({
          title:'Error Updating Student Class',
          text:'There has been an error in updating student class',
          icon:'error',
          timer:1500,
          showConfirmButton:false,
          willClose: () => {
            window.location.reload();
          }
        })
      }

      else {
        Swal.fire({
          title:'Class Updated',
          text:'The class has been updated successfully',
          icon:'success',
          timer:1500,
          showConfirmButton:false,
          willClose: () => {
            window.location.reload();
          }
        })
      }
    }
  }

  return (
    <>
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent style={{backgroundColor:'white'}}>
        <DialogClose></DialogClose>
        <DialogHeader>
          <DialogTitle>Edit Class</DialogTitle>
          <DialogDescription>Make changes to your class details here. Click save when you’re done.</DialogDescription>
        </DialogHeader>
        {/* Content Here */}
        <div>
            <div className="mb-3 row">
                <label className="col-sm-2 col-form-label">Title</label>
                <div className="col-sm-10">
                    <input type="text" value={editTitle} onChange={(e) => dispatch(setEditTitle(e.target.value))} className='form-control'/>
                </div>
            </div>
            <br />

            <div className="mb-3 row">
                <label className="col-sm-2 col-form-label">Section</label>
                <div className="col-sm-10">
                    <input type="text" value={editSection} onChange={(e) => dispatch(setEditSection(e.target.value))} className='form-control'/>
                </div>
            </div>
        </div>
        {/* Content Here */}
        <DialogFooter>
          <button className='btn btn-outline-primary' onClick={() => submit()}>Submit</button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}

export default EditClassModal;