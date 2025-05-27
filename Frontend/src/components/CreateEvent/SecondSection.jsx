// import React, { useRef } from 'react';
// import { Calendar, Clock, Plus, Trash2, Image, X, Upload } from 'lucide-react';
// import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
// import { uploadToCloudinary } from '../../apiConfig/cloudinaryConfig';

// const SecondSection = ({ data, setData }) => {
//   const handleImageUpload = async (type, file) => {
//     try {
//       if (file) {
        
//         const imageUrl = await uploadToCloudinary(file);
//         setData(prev => ({
//           ...prev,
//           schedule: {
//             ...prev.schedule,
//             [type]: imageUrl
//           }
//         }));
//       } else {
        
//         setData(prev => ({
//           ...prev,
//           schedule: {
//             ...prev.schedule,
//             [type]: null
//           }
//         }));
//       }
//     } catch (error) {
//       console.error('Image upload failed:', error);
//       alert('Failed to upload image. Please try again.');
//     }
//   };
//   const getTodayString = () => {
//   const today = new Date();
//   return today.toISOString().split('T')[0];
// };

//   const handleDateChange = (index, field, value) => {
//     const newDates = [...data.schedule.dates];
//     newDates[index] = { ...newDates[index], [field]: value };
    
//     setData(prev => ({
//       ...prev,
//       schedule: {
//         ...prev.schedule,
//         dates: newDates
//       }
//     }));
//   };

//   const addNewDate = () => {
//     const newDate = {
//       id: `date-${Date.now()}`,
//       startDate: '',
//       startTime: '',
//       endDate: '',
//       endTime: ''
//     };

//     setData(prev => ({
//       ...prev,
//       schedule: {
//         ...prev.schedule,
//         dates: [...prev.schedule.dates, newDate]
//       }
//     }));
//   };

//   const removeDate = (index) => {
//     setData(prev => ({
//       ...prev,
//       schedule: {
//         ...prev.schedule,
//         dates: prev.schedule.dates.filter((_, i) => i !== index)
//       }
//     }));
//   };

//   const ImageUploader = ({ type, label, description }) => {
//     const fileInputRef = useRef(null);
//     const imageUrl = data.schedule[type];

//     const handleDrop = async (e) => {
//       e.preventDefault();
//       if (e.dataTransfer.files?.[0]) {
//         await handleImageUpload(type, e.dataTransfer.files[0]);
//       }
//     };

//     const handleFileChange = async (e) => {
//       if (e.target.files?.[0]) {
//         await handleImageUpload(type, e.target.files[0]);
//       }
//     };

//     return (
//       <div className="mb-4">
//         <Form.Group>
//           <Form.Label className="text-white">{label}</Form.Label>
//           <Form.Text className="text-muted d-block mb-2">
//             {description}
//           </Form.Text>

//           {!imageUrl ? (
//             <div
//               className="border border-secondary rounded p-4 text-center"
//               onDragOver={(e) => e.preventDefault()}
//               onDrop={handleDrop}
//               onClick={() => fileInputRef.current?.click()}
//               style={{ cursor: 'pointer' }}
//             >
//               <Upload className="mx-auto mb-2" style={{ width: '2rem', height: '2rem', color: '#6c757d' }} />
//               <div>
//                 <span className="text-warning">Upload a file</span>
//                 <span className="text-muted"> or drag and drop</span>
//                 <Form.Control
//                   type="file"
//                   className="d-none"
//                   accept="image/*"
//                   ref={fileInputRef}
//                   onChange={handleFileChange}
//                 />
//               </div>
//             </div>
//           ) : (
//             <div className="position-relative">
//               <img
//                 src={imageUrl} // الآن نستخدم URL من Cloudinary مباشرة
//                 alt={`${type} preview`}
//                 className="img-fluid rounded"
//                 style={{
//                   height: type === 'coverImage' ? '15rem' : '10rem',
//                   width: '100%',
//                   objectFit: type === 'coverImage' ? 'cover' : 'contain'
//                 }}
//               />
//               <Button 
//                 variant="light"
//                 size="sm"
//                 className="position-absolute top-0 end-0 m-2"
//                 onClick={() => handleImageUpload(type, null)}
//               >
//                 <X size={18} />
//               </Button>
//             </div>
//           )}
//         </Form.Group>
//       </div>
//     );
//   };

//   return (
//     <div style={{ backgroundColor: '#000', minHeight: '100vh' }}>
//       <Container fluid="lg" className="py-4">
//         <Card className="bg-black text-white border-secondary">
//           <Card.Body className="p-4">
//             <div className="border-bottom border-secondary pb-4 mb-4">
//               <h2 className="fw-semibold fs-4 mb-1">Event Schedule & Images</h2>
//               <p className="text-secondary mb-0">Set your event dates and upload promotional images.</p>
//             </div>

//             {/* Dates Section */}
//             <div className="mb-4">
//               <div className="d-flex justify-content-between align-items-center mb-3">
//                 <h3 className="fs-5 text-white">Event Dates</h3>
//                 <Button variant="warning" size="sm" onClick={addNewDate}>
//                   <Plus size={16} className="me-1" />
//                   Add Date
//                 </Button>
//               </div>

//               {data.schedule.dates.map((date, index) => (
//                 <Card key={date.id} className="mb-3 bg-black border-secondary">
//                   <Card.Body>
//                     <Row className="g-3">
//                       <Col md={6}>
//                         <Form.Group>
//                           <Form.Label className="text-white">Start Date</Form.Label>
//                           <Form.Control
//                             type="date"
//                             value={date.startDate}
//                             onChange={(e) => handleDateChange(index, 'startDate', e.target.value)}
//                             className="bg-black text-white border-secondary"
//                           />
//                         </Form.Group>
//                       </Col>
//                       <Col md={6}>
//                         <Form.Group>
//                           <Form.Label className="text-white">Start Time</Form.Label>
//                           <Form.Control
//                             type="time"
//                             value={date.startTime}
//                             onChange={(e) => handleDateChange(index, 'startTime', e.target.value)}
//                             className="bg-black text-white border-secondary"
//                           />
//                         </Form.Group>
//                       </Col>
//                       <Col md={6}>
//                         <Form.Group>
//                           <Form.Label className="text-white">End Date</Form.Label>
//                           <Form.Control
//                             type="date"
//                             value={date.endDate}
//                             onChange={(e) => handleDateChange(index, 'endDate', e.target.value)}
//                             className="bg-black text-white border-secondary"
//                           />
//                         </Form.Group>
//                       </Col>
//                       <Col md={6}>
//                         <Form.Group>
//                           <Form.Label className="text-white">End Time</Form.Label>
//                           <Form.Control
//                             type="time"
//                             value={date.endTime}
//                             onChange={(e) => handleDateChange(index, 'endTime', e.target.value)}
//                             className="bg-black text-white border-secondary"
//                           />
//                         </Form.Group>
//                       </Col>
//                     </Row>
//                     {index > 0 && (
//                       <Button
//                         variant="link"
//                         className="text-danger mt-2 p-0"
//                         onClick={() => removeDate(index)}
//                       >
//                         <Trash2 size={18} />
//                       </Button>
//                     )}
//                   </Card.Body>
//                 </Card>
//               ))}
//             </div>

//             {/* Images Section */}
//             <div className="border-top border-secondary pt-4">
//               <Row className="g-4">
//                 <Col md={6}>
//                   <ImageUploader
//                     type="social_image"
//                     label="Social Media Image"
//                     description="Used for sharing on social media (1200×630 pixels recommended)"
//                   />
//                 </Col>
//                 <Col md={6}>
//                   <ImageUploader
//                     type="cover_image"
//                     label="Event Cover Image"
//                     description="Displayed at the top of your event page (1920×1080 pixels recommended)"
//                   />
//                 </Col>
//               </Row>
//             </div>
//           </Card.Body>
//         </Card>
//       </Container>
//     </div>
//   );
// };

// export default SecondSection;


// import React, { useRef, useEffect, useState } from 'react';
// import { Calendar, Clock, Plus, Trash2, Image, X, Upload } from 'lucide-react';
// import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
// import { uploadToCloudinary } from '../../apiConfig/cloudinaryConfig';

// const SecondSection = ({ data, setData }) => {
//   const [errors, setErrors] = useState({}); // لتخزين أخطاء الحقول

//   const getTodayString = () => {
//     const today = new Date();
//     return today.toISOString().split('T')[0]; // Returns YYYY-MM-DD (e.g., 2025-05-24)
//   };

//   // تحويل التاريخ إلى تنسيق DD/MM/YYYY للعرض (اختياري)
//   const formatDateForDisplay = (date) => {
//     if (!date) return '';
//     const [year, month, day] = date.split('-');
//     return `${day}/${month}/${year}`; // يحول 2025-05-24 إلى 24/05/2025
//   };

//   // تحويل التاريخ من DD/MM/YYYY إلى YYYY-MM-DD للحفظ (اختياري)
//   const parseDateForStorage = (date) => {
//     if (!date) return '';
//     const [day, month, year] = date.split('/');
//     return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`; // يحول 24/05/2025 إلى 2025-05-24
//   };

//   // Clear past dates when the component mounts
//   useEffect(() => {
//     const today = getTodayString();
//     setData(prev => ({
//       ...prev,
//       schedule: {
//         ...prev.schedule,
//         dates: prev.schedule.dates.map(date => ({
//           ...date,
//           startDate: date.startDate && date.startDate < today ? '' : date.startDate,
//           endDate: date.endDate && date.endDate < today ? '' : date.endDate
//         }))
//       }
//     }));
//   }, []);

//   const handleDateChange = (index, field, value) => {
//     const today = getTodayString();
//     const newDates = [...data.schedule.dates];
//     const newErrors = { ...errors };

//     // التحقق فقط إذا كان التاريخ كاملاً (YYYY-MM-DD)
//     const isValidDateFormat = /^\d{4}-\d{2}-\d{2}$/.test(value);
//     if ((field === 'startDate' || field === 'endDate') && isValidDateFormat) {
//       if (value < today) {
//         newErrors[`${field}-${index}`] = 'Cannot select a date before today.';
//         setErrors(newErrors);
//         return;
//       }
//       // التأكد من أن endDate لا يكون قبل startDate
//       if (field === 'startDate' && newDates[index].endDate && newDates[index].endDate < value) {
//         newDates[index].endDate = value;
//         newErrors[`endDate-${index}`] = ''; // إزالة أي خطأ سابق
//       }
//       newErrors[`${field}-${index}`] = ''; // إزالة الخطأ إذا كان التاريخ صالحًا
//     }

//     newDates[index] = { ...newDates[index], [field]: value };
//     setData(prev => ({
//       ...prev,
//       schedule: {
//         ...prev.schedule,
//         dates: newDates
//       }
//     }));
//     setErrors(newErrors);
//   };

//   const addNewDate = () => {
//     const newDate = {
//       id: `date-${Date.now()}`,
//       startDate: '',
//       startTime: '',
//       endDate: '',
//       endTime: ''
//     };

//     setData(prev => ({
//       ...prev,
//       schedule: {
//         ...prev.schedule,
//         dates: [...prev.schedule.dates, newDate]
//       }
//     }));
//   };

//   const removeDate = (index) => {
//     setData(prev => ({
//       ...prev,
//       schedule: {
//         ...prev.schedule,
//         dates: prev.schedule.dates.filter((_, i) => i !== index)
//       }
//     }));
//     setErrors(prev => {
//       const newErrors = { ...prev };
//       delete newErrors[`startDate-${index}`];
//       delete newErrors[`endDate-${index}`];
//       return newErrors;
//     });
//   };

//   const ImageUploader = ({ type, label, description }) => {
//     const fileInputRef = useRef(null);
//     const imageUrl = data.schedule[type];

//     const handleDrop = async (e) => {
//       e.preventDefault();
//       if (e.dataTransfer.files?.[0]) {
//         await handleImageUpload(type, e.dataTransfer.files[0]);
//       }
//     };

//     const handleFileChange = async (e) => {
//       if (e.target.files?.[0]) {
//         await handleImageUpload(type, e.target.files[0]);
//       }
//     };

//     const handleImageUpload = async (type, file) => {
//       try {
//         if (file) {
//           const imageUrl = await uploadToCloudinary(file);
//           setData(prev => ({
//             ...prev,
//             schedule: {
//               ...prev.schedule,
//               [type]: imageUrl
//             }
//           }));
//         } else {
//           setData(prev => ({
//             ...prev,
//             schedule: {
//               ...prev.schedule,
//               [type]: null
//             }
//           }));
//         }
//       } catch (error) {
//         console.error('Image upload failed:', error);
//         alert('Failed to upload image. Please try again.');
//       }
//     };

//     return (
//       <div className="mb-4">
//         <Form.Group>
//           <Form.Label className="text-white">{label}</Form.Label>
//           <Form.Text className="text-muted d-block mb-2">{description}</Form.Text>
//           {!imageUrl ? (
//             <div
//               className="border border-secondary rounded p-4 text-center"
//               onDragOver={(e) => e.preventDefault()}
//               onDrop={handleDrop}
//               onClick={() => fileInputRef.current?.click()}
//               style={{ cursor: 'pointer' }}
//             >
//               <Upload className="mx-auto mb-2" style={{ width: '2rem', height: '2rem', color: '#6c757d' }} />
//               <div>
//                 <span className="text-warning">Upload a file</span>
//                 <span className="text-muted"> or drag and drop</span>
//                 <Form.Control
//                   type="file"
//                   className="d-none"
//                   accept="image/*"
//                   ref={fileInputRef}
//                   onChange={handleFileChange}
//                 />
//               </div>
//             </div>
//           ) : (
//             <div className="position-relative">
//               <img
//                 src={imageUrl}
//                 alt={`${type} preview`}
//                 className="img-fluid rounded"
//                 style={{
//                   height: type === 'coverImage' ? '15rem' : '10rem',
//                   width: '100%',
//                   objectFit: type === 'coverImage' ? 'cover' : 'contain'
//                 }}
//               />
//               <Button
//                 variant="light"
//                 size="sm"
//                 className="position-absolute top-0 end-0 m-2"
//                 onClick={() => handleImageUpload(type, null)}
//               >
//                 <X size={18} />
//               </Button>
//             </div>
//           )}
//         </Form.Group>
//       </div>
//     );
//   };

//   return (
//     <div style={{ backgroundColor: '#000', minHeight: '100vh' }}>
//       <Container fluid="lg" className="py-4">
//         <Card className="bg-black text-white border-secondary">
//           <Card.Body className="p-4">
//             <div className="border-bottom border-secondary pb-4 mb-4">
//               <h2 className="fw-semibold fs-4 mb-1">Event Schedule & Images</h2>
//               <p className="text-secondary mb-0">Set your event dates and upload promotional images.</p>
//             </div>

//             {/* Dates Section */}
//             <div className="mb-4">
//               <div className="d-flex justify-content-between align-items-center mb-3">
//                 <h3 className="fs-5 text-white">Event Dates</h3>
//                 <Button variant="warning" size="sm" onClick={addNewDate}>
//                   <Plus size={16} className="me-1" />
//                   Add Date
//                 </Button>
//               </div>

//               {data.schedule.dates.map((date, index) => (
//                 <Card key={date.id} className="mb-3 bg-black border-secondary">
//                   <Card.Body>
//                     <Row className="g-3">
//                       <Col md={6}>
//                         <Form.Group>
//                           <Form.Label className="text-white">Start Date</Form.Label>
//                           <Form.Control
//                             type="date"
//                             value={date.startDate}
//                             min={getTodayString()}
//                             onChange={(e) => handleDateChange(index, 'startDate', e.target.value)}
//                             onInvalid={(e) => e.target.setCustomValidity('Please select a date today or in the future.')}
//                             onInput={(e) => e.target.setCustomValidity('')}
//                             className="bg-black text-white border-secondary"
//                             required
//                           />
//                           {errors[`startDate-${index}`] && (
//                             <Form.Text className="text-danger">{errors[`startDate-${index}`]}</Form.Text>
//                           )}
//                         </Form.Group>
//                       </Col>
//                       <Col md={6}>
//                         <Form.Group>
//                           <Form.Label className="text-white">Start Time</Form.Label>
//                           <Form.Control
//                             type="time"
//                             value={date.startTime}
//                             onChange={(e) => handleDateChange(index, 'startTime', e.target.value)}
//                             className="bg-black text-white border-secondary"
//                           />
//                         </Form.Group>
//                       </Col>
//                       <Col md={6}>
//                         <Form.Group>
//                           <Form.Label className="text-white">End Date</Form.Label>
//                           <Form.Control
//                             type="date"
//                             value={date.endDate}
//                             min={date.startDate || getTodayString()}
//                             onChange={(e) => handleDateChange(index, 'endDate', e.target.value)}
//                             onInvalid={(e) => e.target.setCustomValidity('Please select a date today or after the start date.')}
//                             onInput={(e) => e.target.setCustomValidity('')}
//                             className="bg-black text-white border-secondary"
//                             required
//                           />
//                           {errors[`endDate-${index}`] && (
//                             <Form.Text className="text-danger">{errors[`endDate-${index}`]}</Form.Text>
//                           )}
//                         </Form.Group>
//                       </Col>
//                       <Col md={6}>
//                         <Form.Group>
//                           <Form.Label className="text-white">End Time</Form.Label>
//                           <Form.Control
//                             type="time"
//                             value={date.endTime}
//                             onChange={(e) => handleDateChange(index, 'endTime', e.target.value)}
//                             className="bg-black text-white border-secondary"
//                           />
//                         </Form.Group>
//                       </Col>
//                     </Row>
//                     {index > 0 && (
//                       <Button
//                         variant="link"
//                         className="text-danger mt-2 p-0"
//                         onClick={() => removeDate(index)}
//                       >
//                         <Trash2 size={18} />
//                       </Button>
//                     )}
//                   </Card.Body>
//                 </Card>
//               ))}
//             </div>

//             {/* Images Section */}
//             <div className="border-top border-secondary pt-4">
//               <Row className="g-4">
//                 <Col md={6}>
//                   <ImageUploader
//                     type="social_image"
//                     label="Social Media Image"
//                     description="Used for sharing on social media (1200×630 pixels recommended)"
//                   />
//                 </Col>
//                 <Col md={6}>
//                   <ImageUploader
//                     type="cover_image"
//                     label="Event Cover Image"
//                     description="Displayed at the top of your event page (1920×1080 pixels recommended)"
//                   />
//                 </Col>
//               </Row>
//             </div>
//           </Card.Body>
//         </Card>
//       </Container>
//     </div>
//   );
// };

// export default SecondSection;



import React, { useRef, useEffect, useState } from 'react';
import { Calendar, Clock, Plus, Trash2, Image, X, Upload } from 'lucide-react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { uploadToCloudinary } from '../../apiConfig/cloudinaryConfig';

const SecondSection = ({ data, setData }) => {
  const [errors, setErrors] = useState({}); // لتخزين أخطاء الحقول

  const getTodayString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Returns YYYY-MM-DD (e.g., 2025-05-24)
  };

  // Clear past dates when the component mounts
  useEffect(() => {
    const today = getTodayString();
    setData(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        dates: prev.schedule.dates.map(date => ({
          ...date,
          startDate: date.startDate && date.startDate < today ? '' : date.startDate,
          endDate: date.endDate && date.endDate < today ? '' : date.endDate
        }))
      }
    }));
  }, []);

  const handleDateChange = (index, field, value) => {
    const today = getTodayString();
    const newDates = [...data.schedule.dates];
    const newErrors = { ...errors };

    // التحقق فقط إذا كان التاريخ كاملاً (YYYY-MM-DD)
    const isValidDateFormat = /^\d{4}-\d{2}-\d{2}$/.test(value);
    if (isValidDateFormat) {
      if (field === 'startDate' || field === 'endDate') {
        // منع التواريخ قبل اليوم
        if (value < today) {
          newErrors[`${field}-${index}`] = 'Cannot select a date before today.';
          setErrors(newErrors);
          return;
        }
        // منع endDate من أن يكون قبل startDate
        if (field === 'endDate' && newDates[index].startDate && value < newDates[index].startDate) {
          newErrors[`endDate-${index}`] = 'End date cannot be before start date.';
          setErrors(newErrors);
          return;
        }
        // إذا تغير startDate وكان endDate موجودًا وأصبح غير صالح
        if (field === 'startDate' && newDates[index].endDate && newDates[index].endDate < value) {
          newDates[index].endDate = value;
          newErrors[`endDate-${index}`] = '';
        }
        newErrors[`${field}-${index}`] = ''; // إزالة الخطأ إذا كان التاريخ صالحًا
      }
    }

    newDates[index] = { ...newDates[index], [field]: value };
    setData(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        dates: newDates
      }
    }));
    setErrors(newErrors);
  };

  const addNewDate = () => {
    const newDate = {
      id: `date-${Date.now()}`,
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: ''
    };

    setData(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        dates: [...prev.schedule.dates, newDate]
      }
    }));
  };

  const removeDate = (index) => {
    setData(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        dates: prev.schedule.dates.filter((_, i) => i !== index)
      }
    }));
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[`startDate-${index}`];
      delete newErrors[`endDate-${index}`];
      return newErrors;
    });
  };

  const ImageUploader = ({ type, label, description }) => {
    const fileInputRef = useRef(null);
    const imageUrl = data.schedule[type];

    const handleDrop = async (e) => {
      e.preventDefault();
      if (e.dataTransfer.files?.[0]) {
        await handleImageUpload(type, e.dataTransfer.files[0]);
      }
    };

    const handleFileChange = async (e) => {
      if (e.target.files?.[0]) {
        await handleImageUpload(type, e.target.files[0]);
      }
    };

    const handleImageUpload = async (type, file) => {
      try {
        if (file) {
          const imageUrl = await uploadToCloudinary(file);
          setData(prev => ({
            ...prev,
            schedule: {
              ...prev.schedule,
              [type]: imageUrl
            }
          }));
        } else {
          setData(prev => ({
            ...prev,
            schedule: {
              ...prev.schedule,
              [type]: null
            }
          }));
        }
      } catch (error) {
        console.error('Image upload failed:', error);
        alert('Failed to upload image. Please try again.');
      }
    };

    return (
      <div className="mb-4">
        <Form.Group>
          <Form.Label className="text-white">{label}</Form.Label>
          <Form.Text className="text-muted d-block mb-2">{description}</Form.Text>
          {!imageUrl ? (
            <div
              className="border border-secondary rounded p-4 text-center"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{ cursor: 'pointer' }}
            >
              <Upload className="mx-auto mb-2" style={{ width: '2rem', height: '2rem', color: '#6c757d' }} />
              <div>
                <span className="text-warning">Upload a file</span>
                <span className="text-muted"> or drag and drop</span>
                <Form.Control
                  type="file"
                  className="d-none"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
              </div>
            </div>
          ) : (
            <div className="position-relative">
              <img
                src={imageUrl}
                alt={`${type} preview`}
                className="img-fluid rounded"
                style={{
                  height: type === 'coverImage' ? '15rem' : '10rem',
                  width: '100%',
                  objectFit: type === 'coverImage' ? 'cover' : 'contain'
                }}
              />
              <Button
                variant="light"
                size="sm"
                className="position-absolute top-0 end-0 m-2"
                onClick={() => handleImageUpload(type, null)}
              >
                <X size={18} />
              </Button>
            </div>
          )}
        </Form.Group>
      </div>
    );
  };

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh' }}>
      <Container fluid="lg" className="py-4">
        <Card className="bg-black text-white border-secondary">
          <Card.Body className="p-4">
            <div className="border-bottom border-secondary pb-4 mb-4">
              <h2 className="fw-semibold fs-4 mb-1">Event Schedule & Images</h2>
              <p className="text-secondary mb-0">Set your event dates and upload promotional images.</p>
            </div>

            {/* Dates Section */}
            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="fs-5 text-white">Event Dates</h3>
                <Button variant="warning" size="sm" onClick={addNewDate}>
                  <Plus size={16} className="me-1" />
                  Add Date
                </Button>
              </div>

              {data.schedule.dates.map((date, index) => (
                <Card key={date.id} className="mb-3 bg-black border-secondary">
                  <Card.Body>
                    <Row className="g-3">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="text-white">Start Date</Form.Label>
                          <Form.Control
                            type="date"
                            value={date.startDate}
                            min={getTodayString()}
                            onChange={(e) => handleDateChange(index, 'startDate', e.target.value)}
                            onInvalid={(e) => e.target.setCustomValidity('Please select a date today or in the future.')}
                            onInput={(e) => e.target.setCustomValidity('')}
                            className="bg-black text-white border-secondary"
                            required
                          />
                          {errors[`startDate-${index}`] && (
                            <Form.Text className="text-danger">{errors[`startDate-${index}`]}</Form.Text>
                          )}
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="text-white">Start Time</Form.Label>
                          <Form.Control
                            type="time"
                            value={date.startTime}
                            onChange={(e) => handleDateChange(index, 'startTime', e.target.value)}
                            className="bg-black text-white border-secondary"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="text-white">End Date</Form.Label>
                          <Form.Control
                            type="date"
                            value={date.endDate}
                            min={date.startDate || getTodayString()}
                            onChange={(e) => handleDateChange(index, 'endDate', e.target.value)}
                            onInvalid={(e) => e.target.setCustomValidity('Please select a date today or after the start date.')}
                            onInput={(e) => e.target.setCustomValidity('')}
                            className="bg-black text-white border-secondary"
                            required
                          />
                          {errors[`endDate-${index}`] && (
                            <Form.Text className="text-danger">{errors[`endDate-${index}`]}</Form.Text>
                          )}
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="text-white">End Time</Form.Label>
                          <Form.Control
                            type="time"
                            value={date.endTime}
                            onChange={(e) => handleDateChange(index, 'endTime', e.target.value)}
                            className="bg-black text-white border-secondary"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    {index > 0 && (
                      <Button
                        variant="link"
                        className="text-danger mt-2 p-0"
                        onClick={() => removeDate(index)}
                      >
                        <Trash2 size={18} />
                      </Button>
                    )}
                  </Card.Body>
                </Card>
              ))}
            </div>

            {/* Images Section */}
            <div className="border-top border-secondary pt-4">
              <Row className="g-4">
                <Col md={6}>
                  <ImageUploader
                    type="social_image"
                    label="Social Media Image"
                    description="Used for sharing on social media (1200×630 pixels recommended)"
                  />
                </Col>
                <Col md={6}>
                  <ImageUploader
                    type="cover_image"
                    label="Event Cover Image"
                    description="Displayed at the top of your event page (1920×1080 pixels recommended)"
                  />
                </Col>
              </Row>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default SecondSection;