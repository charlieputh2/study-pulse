-- Run this directly in your Supabase SQL Editor to populate lab tests table

-- Clear any existing data to avoid duplicates
DELETE FROM lab_test_images;
DELETE FROM lab_test_results;
DELETE FROM lab_tests;

-- Insert sample lab test data (fixed version)
INSERT INTO lab_tests (name, description, test_date, status, purity_result, test_method, report_url, certificate_number, lab_name, technician_name, notes) VALUES
('Tirzepatide Purity Analysis', 'Comprehensive HPLC analysis confirming pharmaceutical-grade purity and identity verification', '2024-01-15', 'passed', '99.8%', 'HPLC-UV', 'https://studypulse.com/reports/tirzepatide-purity-2024-01-15.pdf', 'SP-LAB-2024-001', 'Study Pulse Certified Lab', 'Dr. Sarah Chen', 'Batch #TIR2401 meets all quality specifications'),
('Semaglutide Potency Test', 'Bioassay testing for therapeutic potency verification and activity confirmation', '2024-01-12', 'passed', '99.5%', 'Cell-based Bioassay', 'https://studypulse.com/reports/semaglutide-potency-2024-01-12.pdf', 'SP-LAB-2024-002', 'Study Pulse Certified Lab', 'Dr. Michael Roberts', 'Potency within 98-102% specification range'),
('Molecular Structure Verification', 'Mass spectrometry confirmation of molecular structure and molecular weight verification', '2024-01-10', 'passed', '100%', 'LC-MS/MS', 'https://studypulse.com/reports/tirzepatide-ms-2024-01-10.pdf', 'SP-LAB-2024-003', 'Study Pulse Certified Lab', 'Dr. Emily Watson', 'Molecular weight confirmed: 4753.6 Da'),
('Heavy Metals Screening', 'ICP-MS analysis for heavy metal contamination including lead, arsenic, cadmium, and mercury', '2024-01-08', 'passed', 'Safe', 'ICP-MS', 'https://studypulse.com/reports/heavy-metals-2024-01-08.pdf', 'SP-LAB-2024-004', 'Study Pulse Certified Lab', 'Dr. James Lee', 'All heavy metals below USP limits'),
('Microbial Contamination Test', 'Sterility testing for bacterial and fungal contamination using USP <61> methods', '2024-01-05', 'passed', 'Negative', 'USP <61> Sterility Test', 'https://studypulse.com/reports/microbial-2024-01-05.pdf', 'SP-LAB-2024-005', 'Study Pulse Certified Lab', 'Dr. Lisa Anderson', 'No microbial growth detected after 14 days'),
('Endotoxin Analysis', 'LAL assay for endotoxin level verification using USP <85> methods', '2024-01-03', 'passed', '<0.1 EU/mg', 'LAL Assay', 'https://studypulse.com/reports/endotoxin-2024-01-03.pdf', 'SP-LAB-2024-006', 'Study Pulse Certified Lab', 'Dr. Robert Taylor', 'Endotoxin levels well within specification'),
('Residual Solvent Analysis', 'GC-MS analysis for residual solvents according to ICH Q3C guidelines', '2024-01-01', 'passed', 'Compliant', 'GC-MS', 'https://studypulse.com/reports/solvents-2024-01-01.pdf', 'SP-LAB-2024-007', 'Study Pulse Certified Lab', 'Dr. Maria Garcia', 'All residual solvents below ICH limits'),
('pH and Stability Testing', 'pH measurement and accelerated stability testing under various conditions', '2023-12-28', 'passed', '7.4 ± 0.2', 'pH Meter & Stability Chamber', 'https://studypulse.com/reports/ph-stability-2023-12-28.pdf', 'SP-LAB-2024-008', 'Study Pulse Certified Lab', 'Dr. David Kim', 'Stable for 24 months at 25°C/60% RH'),
('Particle Size Analysis', 'Laser diffraction analysis for particle size distribution and morphology', '2023-12-25', 'passed', 'D50: 45.2 μm', 'Laser Diffraction', 'https://studypulse.com/reports/particle-size-2023-12-25.pdf', 'SP-LAB-2024-009', 'Study Pulse Certified Lab', 'Dr. Jennifer White', 'Particle size within specification range'),
('Water Content Analysis', 'Karl Fischer titration for water content determination', '2023-12-22', 'passed', '2.3%', 'Karl Fischer', 'https://studypulse.com/reports/water-content-2023-12-22.pdf', 'SP-LAB-2024-010', 'Study Pulse Certified Lab', 'Dr. Thomas Brown', 'Water content within specification');

-- Insert detailed test results
INSERT INTO lab_test_results (test_id, parameter_name, parameter_value, unit, reference_range, status)
SELECT 
    lt.id,
    CASE 
        WHEN lt.name LIKE '%Purity%' THEN 'Purity'
        WHEN lt.name LIKE '%Potency%' THEN 'Potency'
        WHEN lt.name LIKE '%Molecular%' THEN 'Molecular Weight'
        WHEN lt.name LIKE '%Heavy Metals%' THEN 'Lead'
        WHEN lt.name LIKE '%Microbial%' THEN 'Total Aerobic Count'
        WHEN lt.name LIKE '%Endotoxin%' THEN 'Endotoxin'
        WHEN lt.name LIKE '%Residual%' THEN 'Acetone'
        WHEN lt.name LIKE '%pH%' THEN 'pH'
        WHEN lt.name LIKE '%Particle%' THEN 'D50'
        WHEN lt.name LIKE '%Water%' THEN 'Water Content'
    END,
    CASE 
        WHEN lt.name LIKE '%Purity%' THEN '99.8'
        WHEN lt.name LIKE '%Potency%' THEN '99.5'
        WHEN lt.name LIKE '%Molecular%' THEN '4753.6'
        WHEN lt.name LIKE '%Heavy Metals%' THEN '<0.1'
        WHEN lt.name LIKE '%Microbial%' THEN '<1'
        WHEN lt.name LIKE '%Endotoxin%' THEN '0.08'
        WHEN lt.name LIKE '%Residual%' THEN '<50'
        WHEN lt.name LIKE '%pH%' THEN '7.4'
        WHEN lt.name LIKE '%Particle%' THEN '45.2'
        WHEN lt.name LIKE '%Water%' THEN '2.3'
    END,
    CASE 
        WHEN lt.name LIKE '%Purity%' THEN '%'
        WHEN lt.name LIKE '%Potency%' THEN '%'
        WHEN lt.name LIKE '%Molecular%' THEN 'Da'
        WHEN lt.name LIKE '%Heavy Metals%' THEN 'ppm'
        WHEN lt.name LIKE '%Microbial%' THEN 'CFU/g'
        WHEN lt.name LIKE '%Endotoxin%' THEN 'EU/mg'
        WHEN lt.name LIKE '%Residual%' THEN 'ppm'
        WHEN lt.name LIKE '%pH%' THEN 'pH'
        WHEN lt.name LIKE '%Particle%' THEN 'μm'
        WHEN lt.name LIKE '%Water%' THEN '%'
    END,
    CASE 
        WHEN lt.name LIKE '%Purity%' THEN '≥98.0%'
        WHEN lt.name LIKE '%Potency%' THEN '95-105%'
        WHEN lt.name LIKE '%Molecular%' THEN '4753.6 ± 1.0'
        WHEN lt.name LIKE '%Heavy Metals%' THEN '<10 ppm'
        WHEN lt.name LIKE '%Microbial%' THEN '<10 CFU/g'
        WHEN lt.name LIKE '%Endotoxin%' THEN '<0.5 EU/mg'
        WHEN lt.name LIKE '%Residual%' THEN '<500 ppm'
        WHEN lt.name LIKE '%pH%' THEN '7.0-8.0'
        WHEN lt.name LIKE '%Particle%' THEN '40-50 μm'
        WHEN lt.name LIKE '%Water%' THEN '<5%'
    END,
    'pass'
FROM lab_tests lt;

-- Additional heavy metals parameters
INSERT INTO lab_test_results (test_id, parameter_name, parameter_value, unit, reference_range, status)
SELECT 
    lt.id,
    param,
    value,
    'ppm',
    ref_range,
    'pass'
FROM lab_tests lt,
unnest(ARRAY['Arsenic', 'Cadmium', 'Mercury']) as param,
unnest(ARRAY['<0.1', '<0.05', '<0.01']) as value,
unnest(ARRAY['<1 ppm', '<0.5 ppm', '<0.1 ppm']) as ref_range
WHERE lt.name LIKE '%Heavy Metals%';

-- Insert lab test images
INSERT INTO lab_test_images (test_id, image_url, image_type, description)
SELECT 
    lt.id,
    CASE 
        WHEN lt.name LIKE '%Purity%' THEN 'https://studypulse.com/images/lab/hplc-chromatogram.jpg'
        WHEN lt.name LIKE '%Potency%' THEN 'https://studypulse.com/images/lab/bioassay-results.jpg'
        WHEN lt.name LIKE '%Molecular%' THEN 'https://studypulse.com/images/lab/mass-spectrum.jpg'
        WHEN lt.name LIKE '%Heavy Metals%' THEN 'https://studypulse.com/images/lab/icp-ms-results.jpg'
        WHEN lt.name LIKE '%Microbial%' THEN 'https://studypulse.com/images/lab/sterility-test.jpg'
        WHEN lt.name LIKE '%Endotoxin%' THEN 'https://studypulse.com/images/lab/lal-assay.jpg'
        WHEN lt.name LIKE '%Residual%' THEN 'https://studypulse.com/images/lab/gc-chromatogram.jpg'
        WHEN lt.name LIKE '%pH%' THEN 'https://studypulse.com/images/lab/ph-meter.jpg'
        WHEN lt.name LIKE '%Particle%' THEN 'https://studypulse.com/images/lab/particle-size.jpg'
        WHEN lt.name LIKE '%Water%' THEN 'https://studypulse.com/images/lab/karl-fischer.jpg'
    END,
    'report',
    CASE 
        WHEN lt.name LIKE '%Purity%' THEN 'HPLC Chromatogram showing 99.8% purity'
        WHEN lt.name LIKE '%Potency%' THEN 'Bioassay dose-response curve'
        WHEN lt.name LIKE '%Molecular%' THEN 'Mass spectrum confirming molecular weight'
        WHEN lt.name LIKE '%Heavy Metals%' THEN 'ICP-MS heavy metals analysis'
        WHEN lt.name LIKE '%Microbial%' THEN 'Sterility test results after 14 days'
        WHEN lt.name LIKE '%Endotoxin%' THEN 'LAL assay endotoxin measurement'
        WHEN lt.name LIKE '%Residual%' THEN 'GC-MS residual solvent analysis'
        WHEN lt.name LIKE '%pH%' THEN 'pH measurement and stability data'
        WHEN lt.name LIKE '%Particle%' THEN 'Particle size distribution curve'
        WHEN lt.name LIKE '%Water%' THEN 'Karl Fischer titration results'
    END
FROM lab_tests lt;

-- Add certificate images
INSERT INTO lab_test_images (test_id, image_url, image_type, description)
SELECT 
    lt.id,
    'https://studypulse.com/images/lab/certificate-analysis.jpg',
    'certificate',
    'Certificate of Analysis - ' || lt.certificate_number
FROM lab_tests lt;

-- Verify data was inserted
SELECT 
    COUNT(*) as total_tests,
    COUNT(CASE WHEN status = 'passed' THEN 1 END) as passed_tests
FROM lab_tests;
