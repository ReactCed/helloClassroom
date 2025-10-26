import {useState} from 'react';
import supabase from '../config/config';
import Swal from 'sweetalert2';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '../components/animate-ui/radix/dialog';

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function AddClassModal({ open, onOpenChange }: ModalProps) {
  const [title, setTitle] = useState("");
  const [section, setSection] = useState("");
  const classUsersID = localStorage.getItem('classUsersID');

  const min = 111111;
  const max = 999999;

  const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;

  const submit = async () => {
    const {data: data2, error: error2} = await supabase.from('class_classprof').select('*').eq('class_classprof_code',randomNum);
    
    if (error2 || data2.length == 0) {
      const {error: error3} = await supabase.from('class_classprof').insert({class_classprof_title: title, class_classprof_section: section, class_classprof_profid: classUsersID, class_classprof_code: randomNum});

      if (error3) {
        Swal.fire({
          title:'Error Adding Class',
          text:'There has been error in adding class',
          icon:'error',
          timer: 1500,
          showConfirmButton: false,
          willClose: () => {
            window.location.reload();
          }
        })
      }

      else {
        Swal.fire({
          title: 'Class Added',
          text: 'The class has been added successfully',
          icon: 'success',
          timer: 1500, 
          showConfirmButton: false, 
          willClose: () => {
            window.location.reload();
          }
        });

      }
    }

    else {
      window.location.reload();
    }
  }

  return (
    <>
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent style={{backgroundColor:'white'}}>
        <DialogClose></DialogClose>
        <DialogHeader>
            <DialogTitle>Add Class</DialogTitle>
            <DialogDescription>Please enter the a information to create a class.</DialogDescription>
        </DialogHeader>
        {/* Content Here */}
        <div>
            <div className="mb-3 row">
                <label className="col-sm-2 col-form-label">Title</label>
                <div className="col-sm-10">
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder='Enter a title' className='form-control'/>
                </div>
            </div>
            <br />

            <div className="mb-3 row">
                <label className="col-sm-2 col-form-label">Section</label>
                <div className="col-sm-10">
                    <input type="text" value={section} onChange={(e) => setSection(e.target.value)} placeholder='Enter a email' className='form-control'/>
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

export default AddClassModal;