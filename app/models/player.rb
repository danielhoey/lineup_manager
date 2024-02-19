# frozen_string_literal: true

class Player < ApplicationRecord
  has_many :position_records
end