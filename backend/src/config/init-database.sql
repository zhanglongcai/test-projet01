-- Add thesis report table
CREATE TABLE t_thesis_report (
  f_id VARCHAR(255) PRIMARY KEY,
  f_user_id UUID NOT NULL REFERENCES t_user(f_id),
  f_file_name VARCHAR(255) NOT NULL,
  f_file_path VARCHAR(255) NOT NULL,
  f_status VARCHAR(20) NOT NULL DEFAULT 'processing',
  f_similarity DECIMAL(5,2),
  f_details JSONB,
  f_error TEXT,
  f_created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  f_updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes
CREATE INDEX idx_thesis_report_user ON t_thesis_report(f_user_id);
CREATE INDEX idx_thesis_report_status ON t_thesis_report(f_status);
CREATE INDEX idx_thesis_report_created ON t_thesis_report(f_created_at);