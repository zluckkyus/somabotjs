let s = env_->LockFile(LockFileName(dbname_), &db_lock_);
  if (!s.ok()) {
    std::cout << s.ToString();
    return s;
  }