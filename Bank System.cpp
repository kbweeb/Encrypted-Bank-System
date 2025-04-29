// Bank Management System with File Encryption (XOR-based) + Admin Login
#include <iostream>
#include <fstream>
#include <vector>
#include <string>
#include <cstdlib> // For exit()

using namespace std;

const char XOR_KEY = '#';
const string ADMIN_PIN = "1234"; // Simple admin authentication

string encryptDecrypt(const string& input) {
    string output = input;
    for (char& c : output) {
        c ^= XOR_KEY;
    }
    return output;
}

class BankAccount {
private:
    string id;
    string name;
    string pin;
    double balance;

public:
    BankAccount(string id, string name, string pin, double balance = 0.0)
        : id(id), name(name), pin(pin), balance(balance) {}

    string getId() const { return id; }
    string getName() const { return name; }
    double getBalance() const { return balance; }

    void deposit(double amount) {
        if (amount > 0) {
            balance += amount;
            cout << "Deposited GHC " << amount << " successfully.\n";
            cout << "Updated Balance: GHC " << balance << "\n";
        } else {
            cout << "Invalid deposit amount.\n";
        }
    }

    void withdraw(double amount) {
        if (amount > 0 && amount <= balance) {
            balance -= amount;
            cout << "Withdrew GHC " << amount << " successfully.\n";
            cout << "Updated Balance: GHC " << balance << "\n";
        } else {
            cout << "Invalid or insufficient funds.\n";
        }
    }

    void display() const {
        cout << "ID: " << id << " | Name: " << name << " | Balance: GHC " << balance << "\n";
    }

    string serialize() const {
        return encryptDecrypt(id + '|' + name + '|' + pin + '|' + to_string(balance));
    }

    static BankAccount deserialize(const string& line) {
        string decrypted = encryptDecrypt(line);
        size_t pos1 = decrypted.find('|');
        size_t pos2 = decrypted.find('|', pos1 + 1);
        size_t pos3 = decrypted.find('|', pos2 + 1);

        string id = decrypted.substr(0, pos1);
        string name = decrypted.substr(pos1 + 1, pos2 - pos1 - 1);
        string pin = decrypted.substr(pos2 + 1, pos3 - pos2 - 1);
        double balance = stod(decrypted.substr(pos3 + 1));

        return BankAccount(id, name, pin, balance);
    }
};

vector<BankAccount> accounts;
const string FILE_NAME = "accounts.dat";

void saveAccounts() {
    ofstream file(FILE_NAME);
    for (auto& acc : accounts) {
        file << acc.serialize() << endl;
    }
    file.close();
}

void loadAccounts() {
    accounts.clear();
    ifstream file(FILE_NAME);
    string line;
    while (getline(file, line)) {
        accounts.push_back(BankAccount::deserialize(line));
    }
    file.close();
}

BankAccount* findAccountById(const string& id) {
    for (auto& acc : accounts) {
        if (acc.getId() == id)
            return &acc;
    }
    return nullptr;
}

void createAccount() {
    string id, name, pin;
    cout << "Enter ID: "; cin >> id;
    cout << "Enter Name: "; cin.ignore(); getline(cin, name);
    cout << "Set 4-digit PIN: "; cin >> pin;
    accounts.emplace_back(id, name, pin);
    cout << "Account created successfully.\n";
    saveAccounts();
}

void depositMoney() {
    string id; double amount;
    cout << "Enter Account ID: "; cin >> id;
    BankAccount* acc = findAccountById(id);
    if (acc) {
        cout << "Enter amount to deposit: "; cin >> amount;
        acc->deposit(amount);
        saveAccounts();
    } else {
        cout << "Account not found.\n";
    }
}

void withdrawMoney() {
    string id; double amount;
    cout << "Enter Account ID: "; cin >> id;
    BankAccount* acc = findAccountById(id);
    if (acc) {
        cout << "Enter amount to withdraw: "; cin >> amount;
        acc->withdraw(amount);
        saveAccounts();
    } else {
        cout << "Account not found.\n";
    }
}

void checkBalance() {
    string id;
    cout << "Enter Account ID: "; cin >> id;
    BankAccount* acc = findAccountById(id);
    if (acc) {
        acc->display();
    } else {
        cout << "Account not found.\n";
    }
}

void showAllAccounts() {
    int attempts = 0;
    string adminPin;
    while (attempts < 4) {
        cout << "Enter Admin PIN: "; cin >> adminPin;
        if (adminPin == ADMIN_PIN) {
            for (const auto& acc : accounts) {
                acc.display();
            }
            return;
        } else {
            cout << "Unauthorized access.\n";
            attempts++;
        }
    }
    cout << "Too many failed attempts. Program will exit.\n";
    exit(1);
}

int main() {
    loadAccounts();
    int choice;
    do {
        cout << "\n===== BANK MANAGEMENT MENU =====\n";
        cout << "1. Create Account\n2. Deposit\n3. Withdraw\n4. Check Balance\n5. Show All Accounts (Admin Only)\n0. Exit\nEnter choice: ";
        cin >> choice;

        switch (choice) {
            case 1: createAccount(); break;
            case 2: depositMoney(); break;
            case 3: withdrawMoney(); break;
            case 4: checkBalance(); break;
            case 5: showAllAccounts(); break;
            case 0: cout << "Goodbye!\n"; break;
            default: cout << "Invalid option.\n";
        }
    } while (choice != 0);

    return 0;
}
