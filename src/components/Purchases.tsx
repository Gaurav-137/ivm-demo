import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Platform } from 'react-native';
import { useState, useRef, createRef } from 'react';
import { addPurchase } from '../dbService';
import { Plus, Trash2 } from 'lucide-react-native';
import { Header } from './Header';
import { DatePicker } from './DatePicker';
import { Dropdown } from './Dropdown';
import { LinearGradient } from 'expo-linear-gradient';

interface PurchaseItem {
  id: string;
  productName: string;
  mrp: string;
  quantity: string;
  costPrice: string;
  batchNo: string;
  expiryDate: Date | null;
}

export function Purchases() {
  const [supplierName, setSupplierName] = useState('');
  const [purchaseDate, setPurchaseDate] = useState(new Date());
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [paidAmount, setPaidAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<PurchaseItem[]>(
    Array.from({ length: 5 }, (_, i) => ({
      id: (i + 1).toString(),
      productName: '',
      mrp: '',
      quantity: '',
      costPrice: '',
      batchNo: '',
      expiryDate: null,
    }))
  );
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Create refs for input fields
  const inputRefs = useRef<any[]>(Array(items.length * 3).fill(null));

  const paymentModes = ['Cash', 'Card', 'UPI', 'Bank Transfer', 'Cheque', 'Credit'];

  // Add 5 more rows if user focuses on last row
  const handleItemInputFocus = (index: number) => {
    if (items.length - index <= 1) {
      const newItems = Array.from({ length: 5 }, (_, i) => ({
        id: (Date.now() + i).toString(),
        productName: '',
        mrp: '',
        quantity: '',
        costPrice: '',
        batchNo: '',
        expiryDate: null,
      }));
      
      setItems(prev => ([...prev, ...newItems]));
      
      // Update refs array size
      inputRefs.current = [...inputRefs.current, ...Array(15).fill(null)];
    }
  };

  const addNewItem = () => {
    const newItem: PurchaseItem = {
      id: Date.now().toString(),
      productName: '',
      mrp: '',
      quantity: '',
      costPrice: '',
      batchNo: '',
      expiryDate: null,
    };
    setItems([...items, newItem]);
    // Update refs array size
    inputRefs.current = [...inputRefs.current, null, null, null];
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof PurchaseItem, value: any) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
    // Clear field-specific errors when user starts typing
    if (errors[`${field}_${items.findIndex(item => item.id === id)}`]) {
      const newErrors = { ...errors };
      delete newErrors[`${field}_${items.findIndex(item => item.id === id)}`];
      setErrors(newErrors);
    }
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      const quantity = parseFloat(item.quantity) || 0;
      const costPrice = parseFloat(item.costPrice) || 0;
      return total + (quantity * costPrice);
    }, 0);
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!supplierName.trim()) {
      newErrors.supplierName = 'Supplier name is required';
    }

    // Validate paid amount
    if (!paymentMode) {
      newErrors.paymentMode = 'Payment mode is required';
    }

    if (!paidAmount.trim()) {
      newErrors.paidAmount = 'Paid Amount is required';
    } else if (isNaN(parseFloat(paidAmount)) || parseFloat(paidAmount) < 0) {
      newErrors.paidAmount = 'Paid Amount must be a valid number';
    }

    // Only validate items that have at least one field filled
    items.forEach((item, index) => {
      // Check if this item has any data entered
      const hasData = item.productName.trim() || item.quantity.trim() || item.costPrice.trim();
      
      if (hasData) {
        if (!item.productName.trim()) {
          newErrors[`productName_${index}`] = 'Product name is required';
        }
        if (!item.quantity.trim()) {
          newErrors[`quantity_${index}`] = 'Quantity is required';
        } else if (parseFloat(item.quantity) <= 0) {
          newErrors[`quantity_${index}`] = 'Quantity must be greater than 0';
        }
        if (!item.costPrice.trim()) {
          newErrors[`costPrice_${index}`] = 'Cost price is required';
        } else if (parseFloat(item.costPrice) <= 0) {
          newErrors[`costPrice_${index}`] = 'Cost price must be greater than 0';
        }
      }
    });

    setErrors(newErrors);
    console.log('Validation errors:', newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    console.log('Submitting with items:', items);
    const filteredItems = items.filter(item => item.productName.trim() || item.quantity.trim() || item.costPrice.trim());
    console.log('Filtered items:', filteredItems);
    
    if (validateForm()) {
      setIsSubmitting(true);
      const purchase = {
        id: '',
        supplierName,
        supplierId: '',
        purchaseDate,
        items: items.filter(item => item.productName.trim() || item.quantity.trim() || item.costPrice.trim()).map(item => ({
          id: '',
          productId: '',
          productName: item.productName,
          mrp: parseFloat(item.mrp) || 0,
          quantity: parseFloat(item.quantity) || 0,
          costPrice: parseFloat(item.costPrice) || 0,
          batchNo: item.batchNo,
          expiryDate: item.expiryDate ?? undefined,
          totalPrice: (parseFloat(item.quantity) || 0) * (parseFloat(item.costPrice) || 0)
        })),
        paymentMode: paymentMode as any,
        paidAmount: parseFloat(paidAmount) || 0,
        totalAmount: calculateTotal(),
        balanceAmount: calculateTotal() - (parseFloat(paidAmount) || 0),
        notes,
        status: 'Completed' as any,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: '',
      };
      try {
        await addPurchase(purchase);
        setIsSubmitting(false);
        Alert.alert(
          'Purchase Recorded Successfully! ✅',
          `Total purchase of ₹${calculateTotal().toFixed(2)} has been recorded and added to inventory.`,
          [{ 
            text: 'OK', 
            onPress: () => {
              setSupplierName('');
              setPurchaseDate(new Date());
              setPaymentMode('Cash');
              setPaidAmount('');
              setNotes('');
              setItems(Array.from({ length: 5 }, (_, i) => ({
                id: (i + 1).toString(),
                productName: '',
                mrp: '',
                quantity: '',
                costPrice: '',
                batchNo: '',
                expiryDate: null,
              })));
              setErrors({});
            }
          }]
        );
      } catch (error) {
        setIsSubmitting(false);
        Alert.alert('Error', 'Failed to record purchase');
      }
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel Purchase',
      'Are you sure you want to cancel this purchase? All data will be lost.',
      [
        { text: 'No', style: 'cancel' },
        { text: 'Yes', onPress: () => {
          setSupplierName('');
          setPurchaseDate(new Date());
          setPaymentMode('Cash');
          setPaidAmount('');
          setNotes('');
          setItems(Array.from({ length: 5 }, (_, i) => ({
            id: (i + 1).toString(),
            productName: '',
            mrp: '',
            quantity: '',
            costPrice: '',
            batchNo: '',
            expiryDate: null,
          })));
          setErrors({});
        }}
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Stock Purchase" subtitle="Record new inventory purchases" />
      
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 140 }}
      >
        {/* Header Section */}
        <LinearGradient colors={['#1E40AF', '#3B82F6']} style={styles.headerGradient}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>New Purchase</Text>
            <Text style={styles.headerSubtitle}>Record new inventory purchases</Text>
          </View>
        </LinearGradient>

        {/* Supplier Information */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Supplier Information</Text>
          
          <View style={styles.row}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Supplier Name <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[styles.input, errors.supplierName && styles.inputError]}
                  placeholder="Enter supplier name"
                  value={supplierName}
                  onChangeText={(text) => {
                    setSupplierName(text);
                    if (errors.supplierName) {
                      const newErrors = { ...errors };
                      delete newErrors.supplierName;
                      setErrors(newErrors);
                    }
                  }}
                />
              </View>
              {errors.supplierName && (
                <Text style={styles.errorText}>{errors.supplierName}</Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Purchase Date</Text>
              <DatePicker
                date={purchaseDate}
                onDateChange={date => setPurchaseDate(date ?? new Date())}
                style={styles.input}
              />
            </View>
          </View>
        </View>

        {/* Items Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Items</Text>
            <TouchableOpacity onPress={addNewItem} style={styles.addButton}>
              <Plus size={16} color="#3B82F6" />
              <Text style={styles.addButtonText}>Add Item</Text>
            </TouchableOpacity>
          </View>
          
          {items.map((item, index) => (
            <View key={item.id} style={styles.itemCard}>
              <Text style={styles.itemNumber}>Item #{index + 1}</Text>
              <View style={styles.itemRow}>
                <View style={styles.itemInputContainer}>
                  <Text style={styles.label}>
                    Product <Text style={styles.required}>*</Text>
                  </Text>
                  <TextInput
                    ref={el => { inputRefs.current[index * 3] = el; }}
                    style={[styles.input, errors[`productName_${index}`] && styles.inputError]}
                    placeholder="Product name"
                    value={item.productName}
                    onChangeText={(value) => updateItem(item.id, 'productName', value)}
                    onFocus={() => handleItemInputFocus(index)}
                    returnKeyType="next"
                    onSubmitEditing={() => inputRefs.current[index * 3 + 1]?.focus()}
                  />
                  {errors[`productName_${index}`] && (
                    <Text style={styles.errorText}>{errors[`productName_${index}`]}</Text>
                  )}
                </View>

                <View style={styles.itemInputContainer}>
                  <Text style={styles.label}>
                    Cost Price <Text style={styles.required}>*</Text>
                  </Text>
                  <TextInput
                    ref={el => { inputRefs.current[index * 3 + 1] = el; }}
                    style={[styles.input, errors[`costPrice_${index}`] && styles.inputError]}
                    placeholder="0.00"
                    value={item.costPrice}
                    onChangeText={(value) => updateItem(item.id, 'costPrice', value)}
                    keyboardType="numeric"
                    onFocus={() => handleItemInputFocus(index)}
                    returnKeyType="next"
                    onSubmitEditing={() => inputRefs.current[index * 3 + 2]?.focus()}
                  />
                  {errors[`costPrice_${index}`] && (
                    <Text style={styles.errorText}>{errors[`costPrice_${index}`]}</Text>
                  )}
                </View>

                <View style={styles.itemInputContainer}>
                  <Text style={styles.label}>
                    Quantity <Text style={styles.required}>*</Text>
                  </Text>
                  <TextInput
                    ref={el => { inputRefs.current[index * 3 + 2] = el; }}
                    style={[styles.input, errors[`quantity_${index}`] && styles.inputError]}
                    placeholder="1"
                    value={item.quantity}
                    onChangeText={(value) => updateItem(item.id, 'quantity', value)}
                    keyboardType="numeric"
                    onFocus={() => handleItemInputFocus(index)}
                    returnKeyType={index < items.slice(0, 5).length - 1 ? "next" : "done"}
                    onSubmitEditing={() => {
                      // If there's a next item, focus on its product name input
                      if (index < items.slice(0, 5).length - 1) {
                        inputRefs.current[(index + 1) * 3]?.focus();
                      }
                    }}
                  />
                  {errors[`quantity_${index}`] && (
                    <Text style={styles.errorText}>{errors[`quantity_${index}`]}</Text>
                  )}
                </View>

                <TouchableOpacity
                  onPress={() => removeItem(item.id)}
                  style={styles.deleteButton}
                  accessibilityRole="button"
                  importantForAccessibility="no"
                  {...(Platform.OS === 'web' ? { tabIndex: -1 } : {})}
                >
                  <Trash2 size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>

              {/* Item Total */}
              {item.quantity && item.costPrice && (
                <View style={styles.itemTotal}>
                  <Text style={styles.itemTotalLabel}>Item Total:</Text>
                  <Text style={styles.itemTotalValue}>
                    ₹{(parseFloat(item.quantity) * parseFloat(item.costPrice)).toFixed(2)}
                  </Text>
                </View>
              )}
            </View>
          ))}

          <TouchableOpacity style={styles.addItemButton} onPress={() => {
            const newItem = {
              id: Date.now().toString(),
              productName: '',
              mrp: '',
              quantity: '',
              costPrice: '',
              batchNo: '',
              expiryDate: null,
            };
            setItems([...items, newItem]);
            inputRefs.current = [...inputRefs.current, null, null, null];
          }}>
            <Plus size={20} color="#3B82F6" />
            <Text style={styles.addItemText}>Add Another Item</Text>
          </TouchableOpacity>

          <View style={styles.row}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Payment Mode <Text style={styles.required}>*</Text></Text>
              <Dropdown
                options={paymentModes}
                selectedValue={paymentMode}
                onValueChange={(value) => {
                  setPaymentMode(value);
                  if (errors.paymentMode) {
                    const newErrors = { ...errors };
                    delete newErrors.paymentMode;
                    setErrors(newErrors);
                  }
                }}
                style={[styles.input, errors.paymentMode && styles.inputError]}
              />
              {errors.paymentMode && (
                <Text style={styles.errorText}>{errors.paymentMode}</Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Paid Amount (₹) <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, errors.paidAmount && styles.inputError]}
                placeholder="0.00"
                value={paidAmount}
                onChangeText={(text) => {
                  setPaidAmount(text);
                  if (errors.paidAmount) {
                    const newErrors = { ...errors };
                    delete newErrors.paidAmount;
                    setErrors(newErrors);
                  }
                }}
                keyboardType="numeric"
              />
              {errors.paidAmount && (
                <Text style={styles.errorText}>{errors.paidAmount}</Text>
              )}
            </View>
          </View>

          {/* Notes section commented out
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Notes</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Additional notes about this purchase..."
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
          */}
        </View>

        {/* Total Section */}
        <LinearGradient colors={['#F8FAFC', '#EBF8FF']} style={styles.totalSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount:</Text>
            <Text style={styles.totalAmount}>₹{calculateTotal().toFixed(2)}</Text>
          </View>
          {paidAmount && (
            <View style={styles.totalRow}>
              <Text style={styles.balanceLabel}>
                {parseFloat(paidAmount) >= calculateTotal() ? 'Excess:' : 'Balance Due:'}
              </Text>
              <Text style={[
                styles.balanceAmount,
                { color: parseFloat(paidAmount) >= calculateTotal() ? '#10B981' : '#EF4444' }
              ]}>
                ₹{Math.abs(calculateTotal() - parseFloat(paidAmount || '0')).toFixed(2)}
              </Text>
            </View>
          )}
        </LinearGradient>
        
        {/* Action Buttons */}
        <View style={{
          flexDirection: 'row',
          gap: 12,
          marginBottom: 30,
        }}>
          <TouchableOpacity 
            style={{
              flex: 1,
              backgroundColor: 'white',
              borderWidth: 1,
              borderColor: '#D1D5DB',
              borderRadius: 12,
              padding: 16,
              alignItems: 'center',
            }} 
            onPress={handleCancel}
          >
            <Text style={{
              fontSize: 16,
              fontFamily: 'Inter-Medium',
              color: '#6B7280',
            }}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              {
                flex: 2,
                borderRadius: 12,
                overflow: 'hidden',
              }, 
              isSubmitting && { opacity: 0.7 }
            ]} 
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <LinearGradient 
              colors={isSubmitting ? ['#9CA3AF', '#6B7280'] : ['#3B82F6', '#1E40AF']} 
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                padding: 16,
              }}
            >
              <Text style={{
                fontSize: 16,
                fontFamily: 'Inter-SemiBold',
                color: 'white',
              }}>
                {isSubmitting ? 'Processing...' : 'Complete Purchase'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    position: 'relative',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  headerGradient: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: 'white',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255,255,255,0.8)',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF8FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  addButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
  },
  formSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  row: {
    flexDirection: 'column',
    gap: 16,
  },
  itemRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
  },
  inputContainer: {
    flex: 1,
    marginBottom: 16,
  },
  itemInputContainer: {
    flex: 1,
    marginBottom: 8,
    minWidth: Platform.OS === 'web' ? '20%' : '30%',
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#374151',
    marginBottom: 8,
  },
  required: {
    color: '#EF4444',
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    backgroundColor: 'white',
  },
  inputError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  inputIcon: {
    position: 'absolute',
    right: 14,
    top: 14,
  },
  scanButton: {
    position: 'absolute',
    right: 12,
    top: 12,
    padding: 4,
  },
  errorText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#EF4444',
    marginTop: 4,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  itemCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  itemNumber: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#3B82F6',
    marginBottom: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  itemTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  deleteButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#FEF2F2',
    alignSelf: 'center',
  },
  itemTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  itemTotalLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  itemTotalValue: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#3B82F6',
  },
  addItemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#3B82F6',
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: 20,
    gap: 8,
    marginBottom: 24,
  },
  addItemText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
  },
  totalSection: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  totalAmount: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1E40AF',
  },
  balanceLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  balanceAmount: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  }
});