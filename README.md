#  Encrypted Bank Management System in C++

A simple yet secure bank management system built in C++ that allows users to create accounts, deposit and withdraw money, and view account balances — with all account data encrypted using an XOR-based method. Admin-only access to full account listings is protected via a PIN.

---

##  Features

-  Account creation with ID, name, and 4-digit PIN
-  Deposit and withdrawal with live balance display
-  Balance inquiry per account
-  XOR-based file encryption for secure data storage
-  Admin-only access to view all accounts (PIN protected)

---

## 🛠 How It Works

1. **Encryption**: Account data is serialized and XOR-encrypted before saving to a file (`accounts.dat`).
2. **Authentication**: Admin functions require a PIN (`1234` by default).
3. **Persistence**: All account actions are saved in real time to the encrypted file.

---

##  Technologies Used

- C++
- Standard Library (`fstream`, `vector`, `string`)
- XOR Encryption (character-level)

---

##  File Structure

